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
    if (!user) {
      const userId = await org.createOidcUser({ iss, sub }, email, {
        mfaPolicy: undefined,
        memberRole: 'Alien',
      });

      key = await org.createKey(Ed25519.Solana, userId, {
        policy: ['AllowRawBlobSigning'],
      });
    } else {
      const userCubeSigner = await CubeSignerInstance.getUserSessionClient(
        oidcToken
      );
      const keys = await userCubeSigner.sessionKeys();
      key = keys?.[keys?.length - 1];
    }

    if (!key) {
      throw Error('Wallet not created');
    }
  } catch (err) {
    throw err;
  }
  return key.materialId;
};
