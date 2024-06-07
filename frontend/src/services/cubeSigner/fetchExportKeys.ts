import { authenticator } from 'otplib';
import {
  CubeSignerClient,
  userExportDecrypt,
  userExportKeygen
} from '@cubist-labs/cubesigner-sdk';
import { CubeSignerInstance } from './cubeSigner';

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

    const exportInProgress = await userClient.org().exports(key?.id).fetch();

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

    const completeExportResult = completeExportResp.data();

    console.log('Complete export');

    const decryptedKey = await userExportDecrypt(
      exportKey.privateKey,
      completeExportResult
    );

    if (decryptedKey) {
      await userClient.org().deleteExport(key.id);
    }

    if (!decryptedKey) {
      throw Error('Export keys failed');
    }
    return decryptedKey;
  }
};
