import axios from 'axios';
import { authenticator } from 'otplib';
import { CubeSignerClient, Ed25519 } from '@cubist-labs/cubesigner-sdk';
import { defaultManagementSessionManager } from '@cubist-labs/cubesigner-sdk-fs-storage';

class CubeSigner {
  private managementSessionClient?: CubeSignerClient;

  async getManagementSessionClient(): Promise<CubeSignerClient> {
    if (!this.managementSessionClient) {
      this.managementSessionClient = await CubeSignerClient.create(
        defaultManagementSessionManager()
      );
    }
    return this.managementSessionClient;
  }

  async getUserSessionClient(oidcToken: string): Promise<CubeSignerClient> {
    const managerSessionClient = await this.getManagementSessionClient();
    console.log('debug > managerSessionClient ==== ', managerSessionClient);

    const resp = await CubeSignerClient.createOidcSession(
      managerSessionClient.env,
      managerSessionClient.orgId,
      oidcToken,
      ['sign:*']
    );

    return CubeSignerClient.create(resp.data());
  }

  parseOidcToken(token: string): {
    iss: string;
    sub: string;
    email: string;
  } {
    const payload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64url').toString('utf8')
    );
    const iss = payload.iss;
    const sub = payload.sub;
    const email = payload.email;
    return { iss, sub, email };
  }
}

export const CubeSignerInstance = new CubeSigner();

const getCubistUsers = async () => {
  const client = await CubeSignerInstance.getManagementSessionClient();
  return client.org().users();
};

const findUser = async (email: string) => {
  const users = await getCubistUsers();
  console.log('debug > users ==== ', users);
  return users.find(
    (user) => user.email === email && user.membership === 'Alien'
  );
};

export const getUserWallet = async (
  oidcToken: string
): Promise<string | null> => {
  let key;

  try {
    const { email, iss, sub } = CubeSignerInstance.parseOidcToken(oidcToken);
    const user = await findUser(email);

    const cubeClient = await CubeSignerInstance.getManagementSessionClient();

    const org = cubeClient.org();
    console.log('debug > user ==== ', user);

    if (!user) {
      const userId = await org.createOidcUser({ iss, sub }, email, {
        mfaPolicy: undefined,
        memberRole: 'Alien'
      });

      key = await org.createKey(Ed25519.Solana, userId, {
        // @ts-ignore
        policy: ['AllowRawBlobSigning']
      });
    } else {
      const userCubeSigner = await CubeSignerInstance.getUserSessionClient(
        oidcToken
      );
      const keys = await userCubeSigner.sessionKeys();
      key = keys?.[keys?.length - 1];
    }
    console.log('debug > key ==== ', key.cached);
    if (!key) {
      throw Error('Wallet not created');
    }
  } catch (err: any) {
    console.log('debug > err ==== ', JSON.stringify(err));
    if (Error(`${err}`).message.includes('Forbidden')) {
      await axios.post(`${process.env.SITE_URL}/auth/logout`);
    }
    throw err;
  }
  return key.materialId;
};

export const exportUserInfo = async (
  oidcToken: string
): Promise<string | null> => {
  let key;

  try {
    const { email } = CubeSignerInstance.parseOidcToken(oidcToken);
    const user = await findUser(email);

    const cubeClient = await CubeSignerInstance.getManagementSessionClient();

    const org = cubeClient.org();
    if (!user) {
      throw Error('User not found');
    } else {
      const userCubeSigner = await CubeSignerInstance.getUserSessionClient(
        oidcToken
      );
      const keys = await userCubeSigner.sessionKeys();
      key = keys?.[keys?.length - 1];

      await org.initExport(key.id);

      // keysExport = await org.completeExport(key.id, key.publicKey);
      // console.log('debug > keypairExport===', keysExport);
      await org.deleteExport(key.id, key.publicKey);

      // if (!keysExport) {
      //   throw Error('Export keys failed');
      // }
    }
  } catch (err) {
    console.log('debug > ERROR' + err);
    throw err;
  }
  return key.materialId;
};

// Set up TOTP for a user
export const setUpTotp = async (oidcToken: string) => {
  let mfaClient: CubeSignerClient | undefined = undefined;
  const cubeClient = await CubeSignerInstance.getManagementSessionClient();
  const oidcSessionResp = await CubeSignerClient.createOidcSession(
    cubeClient.env,
    cubeClient.orgId,
    oidcToken,
    ['sign:*', 'manage:mfa']
  );

  if (oidcSessionResp.requiresMfa()) {
    const tmpClient = await oidcSessionResp.mfaClient()!;

    mfaClient = tmpClient;

    const mfaId = oidcSessionResp.mfaId();
    console.log('debug > mfaId===', mfaId);

    if (mfaClient) {
      const mfaInfo = await mfaClient.org().getMfaRequest(mfaId).fetch();
      console.log('debug > mfaInfo===', mfaInfo);
    }
  }

  const oidcClient = await CubeSignerClient.create(oidcSessionResp.data());

  let totpResetResp = await oidcClient.resetTotp();
  //TODO implement TOTP user secret
  const secret = 'KVKFKRCPNZQUYMLXOVYDSQKJKZDTSRLD';
  let totpSecret: string | null = process.env['CS_USER_TOTP_SECRET']! || secret;
  console.log(
    'debug > totpResetResp.requiresMfa()===',
    totpResetResp.requiresMfa()
  );
  if (totpResetResp.requiresMfa()) {
    console.log('Resetting TOTP requires MFA');
    const code = authenticator.generate(totpSecret);
    totpResetResp = await totpResetResp.totpApprove(oidcClient, code);
    console.log('MFA approved using existing TOTP');
  }

  const totpChallenge = totpResetResp.data();
  console.log('debug > totpChallenge.url===', totpChallenge);
  if (totpChallenge.url) {
    totpSecret = new URL(totpChallenge.url).searchParams.get('secret');
    if (totpSecret) {
      await totpChallenge.answer(authenticator.generate(totpSecret));
      console.log(`Verifying current TOTP code`);
      let code = authenticator.generate(totpSecret);
      await oidcClient.verifyTotp(code);
    }
  }

  const mfa = (await oidcClient.user()).mfa;
  console.log('Configured MFA types', mfa);

  console.log(mfa.map((m) => m.type).includes('totp'));
};

export const checkIfMfaReguired = async (
  oidcToken: string
): Promise<{ mfaId: string; otpauth: string } | null> => {
  let mfaClient: CubeSignerClient | undefined = undefined;
  const user = 'yuramoldev@gmail.com';
  const secret = 'KVKFKRCPNZQUYMLXOVYDSQKJKZDTSRLD';
  const service = 'Moonshot';

  const cubeClient = await CubeSignerInstance.getManagementSessionClient();
  const oidcSessionResp = await CubeSignerClient.createOidcSession(
    cubeClient.env,
    cubeClient.orgId,
    oidcToken,
    ['sign:*', 'manage:mfa']
  );

  if (oidcSessionResp.requiresMfa()) {
    const tmpClient = await oidcSessionResp.mfaClient()!;

    mfaClient = tmpClient;

    const mfaId = oidcSessionResp.mfaId();

    if (mfaClient) {
      const mfaInfo = await mfaClient.org().getMfaRequest(mfaId).fetch();
      console.log('debug > mfaInfo===', mfaInfo);
    }
    const otpauth = authenticator.keyuri(user, service, secret);

    return { mfaId, otpauth };
  }
  return null;
};

export const approveMfaTotp = async (
  oidcToken: string,
  totpCode: number
  // mfaId: string
) => {
  let mfaClient: CubeSignerClient | undefined = undefined;
  let mfaId: string = '';
  const cubeClient = await CubeSignerInstance.getManagementSessionClient();
  const oidcSessionResp = await CubeSignerClient.createOidcSession(
    cubeClient.env,
    cubeClient.orgId,
    oidcToken,
    ['sign:*', 'manage:mfa']
  );

  if (oidcSessionResp.requiresMfa()) {
    const tmpClient = await oidcSessionResp.mfaClient()!;

    mfaClient = tmpClient;

    const mfaId = oidcSessionResp.mfaId();

    if (mfaClient) {
      const mfaInfo = await mfaClient.org().getMfaRequest(mfaId).fetch();
      console.log('debug > mfaInfo===', mfaInfo);
    }
  }

  if (!mfaClient || !totpCode) {
    return false;
  }
  console.log('debug > totpCode===', totpCode);
  const oidcClient = await CubeSignerClient.create(oidcSessionResp.data());

  let totpResetResp = await oidcClient.resetTotp();
  try {
    const status = await mfaClient
      .org()
      .getMfaRequest(mfaId)
      .totpApprove(`${totpCode}`);
    const receipt = await status.receipt();
    console.log('debug > receipt===', receipt);
  } catch (err) {
    throw Error('Err:' + err);
  }
};