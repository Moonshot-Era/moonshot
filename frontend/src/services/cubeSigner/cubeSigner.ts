import axios from 'axios';
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

    const sessionData = resp.data();
    return CubeSignerClient.create(sessionData);
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
    if (Error(`${err}`).message.includes('Forbidden')) {
      await axios.post(`${process.env.SITE_URL}/auth/logout`);
    } else {
      console.log('err while getting wallet ==== ', JSON.stringify(err));
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
