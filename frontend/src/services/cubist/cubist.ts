import { CubeSignerClient, Ed25519 } from '@cubist-labs/cubesigner-sdk';
import { defaultManagementSessionManager } from '@cubist-labs/cubesigner-sdk-fs-storage';

class CubeSigner {
  private orgClient?: CubeSignerClient;

  async getClient(): Promise<CubeSignerClient> {
    if (!this.orgClient) {
      this.orgClient = await CubeSignerClient.create(
        defaultManagementSessionManager(),
      );
    }
    return this.orgClient;
  }

  parseOidcToken(token: string): {
    iss: string;
    sub: string;
    email: string;
  } {
    const payload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64url').toString('utf8'),
    );
    const iss = payload.iss;
    const sub = payload.sub;
    const email = payload.email;
    return { iss, sub, email };
  }
}

export const CubeSignerInstance = new CubeSigner();

const getCubistUsers = async () => {
  const client = await CubeSignerInstance.getClient();
  console.log('debug > client ==== ', JSON.stringify(client.env));
  return client.org().users();
};

const findUser = async (email: string) => {
  const users = await getCubistUsers();
  return users.find(
    user => user.email === email && user.membership === 'Alien',
  );
};

export const getUserWallet = async (oidcToken: string) => {
  try {
    const { email, iss, sub } = CubeSignerInstance.parseOidcToken(oidcToken);
    const user = await findUser(email);

    const cubeClient = await CubeSignerInstance.getClient();

    const org = cubeClient.org();

    let userId = user?.id;

    if (!user) {
      userId = await org.createOidcUser({ iss, sub }, email, {
        mfaPolicy: undefined,
        memberRole: 'Alien',
      });
    }
    console.log('debug > userId ==== ', userId);

    const key = await org.createKey(Ed25519.Solana, userId);
    console.log('debug > key ==== ', key);
  } catch (err) {
    console.log('debug > err ==== ', err);
  }
};
