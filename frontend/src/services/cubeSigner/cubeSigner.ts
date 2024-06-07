import { authenticator } from 'otplib';
import {
  CubeSignerClient,
  Ed25519,
  Key,
  userExportDecrypt,
  userExportKeygen
} from '@cubist-labs/cubesigner-sdk';
import { defaultManagementSessionManager } from '@cubist-labs/cubesigner-sdk-fs-storage';
import { getMfaSecret } from '../helpers/getMfaSecret';
import { setMfaSecret } from '../helpers/setMfaSecret';

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

const getLatestKey = (keys: Key[]) => {
  const latestKey = keys?.sort((a, b) =>
    a.cached.created && b.cached.created
      ? b.cached.created - a.cached.created
      : 0
  )?.[0];

  return latestKey || keys?.[keys?.length - 1];
};

export const getUserWallet = async (
  oidcToken: string,
  totpSecret: string
): Promise<string | null> => {
  let key;
  try {
    const { email, iss, sub } = CubeSignerInstance.parseOidcToken(oidcToken);
    const user = await findUser(email);

    const cubeClient = await CubeSignerInstance.getManagementSessionClient();
    const org = cubeClient.org();

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
        if (tmpClient) {
          const totpOidcCode = authenticator.generate(totpSecret);
          const totpResp = await oidcSessionResp.totpApprove(
            tmpClient,
            totpOidcCode
          );

          const userCubeSigner = await CubeSignerClient.create(totpResp.data());
          const keys = await userCubeSigner.sessionKeys();
          key = getLatestKey(keys);
          keys?.map((keyItem) => {
            console.log('debug > keyItem===', keyItem);
          });
        }
      } else {
        const userCubeSigner = await CubeSignerClient.create(
          oidcSessionResp.data()
        );
        const keys = await userCubeSigner.sessionKeys();
        key = getLatestKey(keys);
      }
    }

    if (!key || !key?.materialId) {
      throw Error('Wallet not created');
    }
  } catch (err: any) {
    throw err;
  }
  return key?.materialId;
};

export const fetchExportKeys = async (oidcToken: string, mfaSecret: string) => {
  let userClient: CubeSignerClient | undefined = undefined;
  let totpSecret = mfaSecret;
  const cubeClient = await CubeSignerInstance.getManagementSessionClient();

  try {
    const userSessionResp = await CubeSignerClient.createOidcSession(
      cubeClient.env,
      cubeClient.orgId,
      oidcToken,
      ['sign:*', 'export:user:*', 'manage:*']
    );

    if (userSessionResp.requiresMfa()) {
      const tmpClient = await userSessionResp.mfaClient()!;
      if (tmpClient) {
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
        totpSecret =
          new URL(totpChallenge.url).searchParams.get('secret') || '';

        await setMfaSecret(totpSecret);
        await totpChallenge.answer(authenticator.generate(totpSecret));
      }
    }

    if (userClient) {
      const keys = await userClient.sessionKeys();
      const key = getLatestKey(keys);
      // const key =
      //   keys?.find(
      //     (key) =>
      //       key.materialId === 'AY2QK7Roy6QHSjTsPZN3k9v6ff5gnu4jpdTxyauEtbbh'
      //   ) || keys?.[keys?.length - 1];

      let exportInProgress = await userClient.org().exports(key?.id).fetch();
      console.log('debug > exportInProgress===', exportInProgress);
      if (!exportInProgress?.length) {
        // initiate an export
        const initExportResp = await userClient.org().initExport(key.id);
        await initExportResp.totpApprove(
          userClient,
          authenticator.generate(totpSecret)
        );
        console.log('Initialize export');
      }

      const timeoutDelay = async () => setTimeout(() => {}, 2000);

      await timeoutDelay();
      console.log('Timeout....');
      exportInProgress = await userClient.org().exports(key?.id).fetch();
      console.log('debug > exportInProgress===', exportInProgress);

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
      const completeExportResult = completeExportResp.data();
      console.log('Complete export');

      // decrypt key
      const decryptedKey = await userExportDecrypt(
        exportKey.privateKey,
        completeExportResult
      );

      console.log('decryptedKey', decryptedKey);
      // if (decryptedKey) {
      //   await userClient.org().deleteExport(key.id);
      // }

      if (!decryptedKey) {
        throw Error('Export keys failed');
      }
      return decryptedKey;
    }
  } catch (err) {
    throw Error('Export keys failed' + err);
  }
};
