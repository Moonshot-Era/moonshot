'use server';

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

let managementSessionClient: CubeSignerClient | undefined;

const getManagementSessionClient = async (): Promise<CubeSignerClient> => {
  if (!managementSessionClient) {
    managementSessionClient = await CubeSignerClient.create(
      defaultManagementSessionManager()
    );
  }
  return managementSessionClient;
};

export const getUserSessionClient = async (
  oidcToken: string
): Promise<CubeSignerClient> => {
  let userClient: CubeSignerClient | undefined = undefined;
  try {
    const managerSessionClient = await getManagementSessionClient();

    const userSessionResp = await CubeSignerClient.createOidcSession(
      managerSessionClient.env,
      managerSessionClient.orgId,
      oidcToken,
      ['sign:*', 'manage:*', 'export:*', 'export:user:*']
    );

    if (userSessionResp.requiresMfa()) {
      const totpSecret = await getMfaSecret();

      if (totpSecret) {
        const tmpClient = await userSessionResp.mfaClient()!;
        if (tmpClient) {
          const totpResp = await userSessionResp.totpApprove(
            tmpClient,
            authenticator.generate(totpSecret)
          );
          userClient = await CubeSignerClient.create(totpResp.data());
        }
      }
    } else {
      userClient = await CubeSignerClient.create(userSessionResp.data());
      let totpResetResp = await userClient.resetTotp();
      const totpChallenge = totpResetResp.data();
      if (totpChallenge.url) {
        const newTotpSecret =
          new URL(totpChallenge.url).searchParams.get('secret') || '';

        await setMfaSecret(newTotpSecret);
        await totpChallenge.answer(authenticator.generate(newTotpSecret));
      }
    }

    if (!userClient) {
      throw Error('User client error');
    }

    return userClient;
  } catch (err) {
    throw err;
  }
};

const parseOidcToken = (
  token: string
): {
  iss: string;
  sub: string;
  email?: string;
} => {
  const payload = JSON.parse(
    Buffer.from(token.split('.')[1], 'base64url').toString('utf8')
  );
  const iss = payload.iss;
  const sub = payload.sub;
  const email = payload.email;

  return { iss, sub, email };
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
  userEmail?: string
): Promise<string | null> => {
  let key;

  try {
    const cubeClient = await getManagementSessionClient();

    const proveOidcIdentity = await CubeSignerClient.proveOidcIdentity(
      cubeClient.env,
      cubeClient.orgId,
      oidcToken
    );

    if (!proveOidcIdentity.user_info) {
      const org = cubeClient.org();
      const { iss, sub, email } = parseOidcToken(oidcToken);
      const userId = await org.createOidcUser(
        { iss, sub },
        email || userEmail,
        {
          mfaPolicy: undefined,
          memberRole: 'Alien'
        }
      );

      key = await org.createKey(Ed25519.Solana, userId, {
        // @ts-ignore
        policy: ['AllowRawBlobSigning']
      });

      if (!key || !key?.materialId) {
        throw Error('Wallet not created');
      }
      return key.materialId;
    }

    const userCubeSigner = await getUserSessionClient(oidcToken);

    const keys = await userCubeSigner.sessionKeys();
    key = getLatestKey(keys);

    if (!key || !key?.materialId) {
      throw Error('Wallet not created');
    }
  } catch (err: any) {
    throw err;
  }
  return key.materialId;
};

export const fetchInitiateExportKeys = async (oidcToken: string) => {
  try {
    const totpSecret = await getMfaSecret();
    const userClient = await getUserSessionClient(oidcToken);

    if (userClient) {
      const keys = await userClient.sessionKeys();
      const key = getLatestKey(keys);

      let exportInProgress = await userClient.org().exports(key?.id).fetch();
      if (!exportInProgress?.length) {
        // initiate an export
        const initExportResp = await userClient.org().initExport(key.id);
        const resp = await initExportResp.totpApprove(
          userClient,
          authenticator.generate(totpSecret)
        );
        console.log('Initialize export');
        return resp?.data()?.valid_epoch;
      }
      return exportInProgress?.[0]?.valid_epoch;
    }
  } catch (err) {
    throw err;
  }
};

export const fetchExportKeys = async (oidcToken: string) => {
  try {
    const totpSecret = await getMfaSecret();
    const userClient = await getUserSessionClient(oidcToken);

    if (userClient) {
      const keys = await userClient.sessionKeys();
      const key = getLatestKey(keys);

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

      if (!decryptedKey) {
        throw Error('Export keys failed');
      }
      return decryptedKey;
    }
  } catch (err) {
    throw err;
  }
};
