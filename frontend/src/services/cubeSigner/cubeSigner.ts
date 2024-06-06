import axios from 'axios';
import { authenticator, totp } from 'otplib';
import {
  CubeSignerClient,
  Ed25519,
  userExportDecrypt,
  userExportKeygen
} from '@cubist-labs/cubesigner-sdk';
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
      ['sign:*', 'manage:*']
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
  let totpSecret: string | null = 'SBCXRKMQOSFA6QTRGGVQR4BDWVPNQN5Y';
  let mfaClient: CubeSignerClient | undefined = undefined;

  try {
    const { email, iss, sub } = CubeSignerInstance.parseOidcToken(oidcToken);
    const user = await findUser(email);

    const cubeClient = await CubeSignerInstance.getManagementSessionClient();

    const org = cubeClient.org();
    console.log('debug > user ==== ', user?.id);
    // key = await org.createKey(Ed25519.Solana, user?.id, {
    //   // @ts-ignore
    //   policy: ['AllowRawBlobSigning']
    // });
    // console.log('debug > materialId===', key.materialId);

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
      const oidcSessionResp = await CubeSignerClient.createOidcSession(
        cubeClient.env,
        cubeClient.orgId,
        oidcToken,
        ['sign:*', 'manage:*', 'export:*']
      );

      if (oidcSessionResp.requiresMfa()) {
        const tmpClient = await oidcSessionResp.mfaClient()!;

        mfaClient = tmpClient;

        if (mfaClient && tmpClient) {
          const totpOidcCode = authenticator.generate(totpSecret);
          const totpResp = await oidcSessionResp.totpApprove(
            tmpClient,
            totpOidcCode
          );

          const userCubeSigner = await CubeSignerClient.create(totpResp.data());
          const keys = await userCubeSigner.sessionKeys();
          key = keys?.[keys?.length - 1];
          keys?.map((keyItem) => {
            console.log('debug > keyItem===', keyItem?.materialId);
          });
          // console.log('debug > userCubeSigner===', key?.materialId);
        }
      } else {
        const userCubeSigner = await CubeSignerClient.create(
          oidcSessionResp.data()
        );

        console.log('debug > userCubeSigner===', userCubeSigner);

        const keys = await userCubeSigner.sessionKeys();
        key = keys?.[keys?.length - 1];
        keys?.map((keyItem) => {
          console.log('debug > keyItem===', keyItem?.materialId);
        });
      }
    }

    if (!key) {
      throw Error('Wallet not created');
    }
  } catch (err: any) {
    // if (Error(`${err}`).message.includes('Forbidden')) {
    //   await axios.post(`${process.env.SITE_URL}/auth/logout`);
    // } else {
    //   console.log('err while getting wallet ==== ', JSON.stringify(err));
    // }
    throw err;
  }
  return key?.materialId || '';
};

export const fetchExportKeys = async (oidcToken: string) => {
  let mfaClient: CubeSignerClient | undefined = undefined;
  let userClient: CubeSignerClient | undefined = undefined;
  let totpSecret: string = 'SBCXRKMQOSFA6QTRGGVQR4BDWVPNQN5Y';
  const cubeClient = await CubeSignerInstance.getManagementSessionClient();

  const userSessionResp = await CubeSignerClient.createOidcSession(
    cubeClient.env,
    cubeClient.orgId,
    oidcToken,
    ['sign:*', 'export:user:*', 'manage:*']
  );

  if (userSessionResp.requiresMfa()) {
    const tmpClient = await userSessionResp.mfaClient()!;
    mfaClient = tmpClient;
    if (mfaClient && tmpClient) {
      const totpResp = await userSessionResp.totpApprove(
        tmpClient,
        authenticator.generate(totpSecret)
      );
      userClient = await CubeSignerClient.create(totpResp.data());
    }
  } else {
    userClient = await CubeSignerClient.create(userSessionResp.data());
    let totpResetResp = await userClient.resetTotp();
    const totpChallenge = totpResetResp.data();
    if (totpChallenge.url) {
      totpSecret = new URL(totpChallenge.url).searchParams.get('secret') || '';
      console.log('debug > totpSecret===', totpSecret);
      await totpChallenge.answer(authenticator.generate(totpSecret));
    }
  }

  if (userClient) {
    const keys = await userClient.sessionKeys();
    // const key = keys?.[keys?.length - 1];
    const key =
      keys?.find(
        (key) =>
          key.materialId === 'AY2QK7Roy6QHSjTsPZN3k9v6ff5gnu4jpdTxyauEtbbh'
      ) || keys?.[keys?.length - 1];
    console.log('debug > keyForExport===', key?.id);

    const exportInProgress = await userClient.org().exports(key?.id).fetch();

    console.log(
      'debug > exportInProgress===',
      exportInProgress?.length,
      !exportInProgress?.length,
      exportInProgress
    );

    if (!exportInProgress?.length) {
      // initiate an export
      const initExportResp = await userClient.org().initExport(key.id);
      await initExportResp.totpApprove(
        userClient,
        authenticator.generate(totpSecret)
      );
      console.log('Initialize export');
    }

    // generate a key
    const exportKey = await userExportKeygen();

    // complete an export
    let completeExportResp = await userClient
      .org()
      .completeExport(key.id, exportKey.publicKey);
    completeExportResp = await completeExportResp.totpApprove(
      userClient,
      authenticator.generate(totpSecret)
    );
    console.log(
      'completeExportResp.requiresMfa ====',
      completeExportResp.requiresMfa()
    );
    const completeExportResult = completeExportResp.data();

    console.log('Complete export');

    const decryptedKey = await userExportDecrypt(
      exportKey.privateKey,
      completeExportResult
    );

    console.log('debug > decryptedKeys===', decryptedKey);

    // const deleteExportResp = await org.deleteExport(key.id);

    if (!decryptedKey) {
      throw Error('Export keys failed');
    }
    return decryptedKey;
  }
};