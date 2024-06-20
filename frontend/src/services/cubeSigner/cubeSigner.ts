'use server';

import { authenticator } from 'otplib';
import {
  CubeSignerClient,
  Ed25519,
  Key,
  refresh,
  isRefreshable,
  userExportDecrypt,
  userExportKeygen,
  SessionData,
  isStale
} from '@cubist-labs/cubesigner-sdk';
import { defaultManagementSessionManager } from '@cubist-labs/cubesigner-sdk-fs-storage';

import { createServerClient } from '@/supabase/server';
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

export const storeCubeSignerSessionData = async (
  oidcToken: string,
  userEmail: string
) => {
  await createCubeSignerUserIfNotExist(oidcToken, userEmail);

  const cubeSignerSessionData = await createCubeSignerSessionData(oidcToken);

  const supabaseServerClient = createServerClient();

  await supabaseServerClient.rpc('store_session_data', {
    session_data: JSON.stringify(cubeSignerSessionData)
  });
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

const createCubeSignerSessionData = async (
  oidcToken: string
): Promise<SessionData> => {
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
      const tmpClient = await userSessionResp.mfaClient();
      if (tmpClient) {
        const totpResp = await userSessionResp.totpApprove(
          tmpClient,
          authenticator.generate(totpSecret)
        );

        return totpResp.data();
      } else {
        throw Error('MFA client is required');
      }
    } else {
      throw Error('Totp secret is required');
    }
  } else {
    const sessionData = userSessionResp.data();
    const userClient = await CubeSignerClient.create(userSessionResp.data());
    let totpResetResp = await userClient.resetTotp();
    const totpChallenge = totpResetResp.data();
    if (totpChallenge.url) {
      const newTotpSecret =
        new URL(totpChallenge.url).searchParams.get('secret') || '';
      await totpChallenge.answer(authenticator.generate(newTotpSecret));

      await setMfaSecret(newTotpSecret);
      // TODO Consider to delete user from cubesigner if error
      return sessionData;
    } else {
      throw Error('Totp challenge url is required');
    }
  }
};

const createCubeSignerUserIfNotExist = async (
  oidcToken: string,
  userEmail: string
) => {
  const managerSessionClient = await getManagementSessionClient();

  const proveOidcIdentity = await CubeSignerClient.proveOidcIdentity(
    managerSessionClient.env,
    managerSessionClient.orgId,
    oidcToken
  );

  if (!proveOidcIdentity.user_info) {
    const org = managerSessionClient.org();
    const { iss, sub, email } = parseOidcToken(oidcToken);
    const userId = await org.createOidcUser({ iss, sub }, email || userEmail, {
      mfaPolicy: undefined,
      memberRole: 'Alien'
    });

    await org.createKey(Ed25519.Solana, userId, {
      // @ts-ignore
      policy: ['AllowRawBlobSigning']
    });
  }
};

export const getUserSessionClient = async (): Promise<CubeSignerClient> => {
  let userClient: CubeSignerClient | undefined = undefined;
  const supabaseServerClient = createServerClient();

  const { data: sessionDataResponse, error: sessionDataError } =
    await supabaseServerClient.rpc('get_session_data');

  if (sessionDataError) {
    throw Error(sessionDataError.message);
  }

  if (!sessionDataResponse) {
    throw Error('Session data is missing.');
  }

  let sessionData: SessionData = JSON.parse(sessionDataResponse);
  if (isStale(sessionData)) {
    if (!isRefreshable(sessionData)) {
      throw Error('Session cannot be refreshed. User needs to log in again');
    }

    sessionData = await refresh(sessionData);

    await supabaseServerClient.rpc('store_session_data', {
      session_data: JSON.stringify(sessionData)
    });
  }

  userClient = await CubeSignerClient.create(sessionData);

  if (!userClient) {
    throw Error('CubeSignerClient does not created');
  }

  return userClient;
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
  userSessionClient: CubeSignerClient
): Promise<string | null> => {
  let key;

  try {
    const keys = await userSessionClient.sessionKeys();
    key = getLatestKey(keys);

    if (!key || !key?.materialId) {
      throw Error('Wallet not created');
    }
  } catch (err: any) {
    throw err;
  }
  return key.materialId;
};

export const fetchInitiateExportKeys = async () => {
  try {
    const totpSecret = await getMfaSecret();
    const userClient = await getUserSessionClient();

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

export const fetchExportKeys = async () => {
  try {
    const totpSecret = await getMfaSecret();
    const userClient = await getUserSessionClient();

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
