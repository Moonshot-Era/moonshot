import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction
} from '@solana/web3.js';

import { authenticator } from 'otplib';
import { CubeSignerClient } from '@cubist-labs/cubesigner-sdk';

import { CubeSignerInstance } from '../cubeSigner';

export const sendNativeTransaction = async (
  oidcToken: string,
  fromAddress: string,
  toAddress: string,
  amount: number
) => {
  //TODO get from supabase
  let totpSecret: string = 'SBCXRKMQOSFA6QTRGGVQR4BDWVPNQN5Y';
  let userClient: CubeSignerClient | undefined = undefined;

  const cubeClient = await CubeSignerInstance.getManagementSessionClient();
  const userSessionResp = await CubeSignerClient.createOidcSession(
    cubeClient.env,
    cubeClient.orgId,
    oidcToken,
    ['sign:*', 'manage:*']
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
  }

  if (userClient) {
    try {
      const connection = new Connection(
        process.env.SOLANA_RPC_PROVIDER,
        'confirmed'
      );

      const fromPubkey = new PublicKey(fromAddress);
      const toPubkey = new PublicKey(toAddress);

      console.log(
        `Transferring ${amount} SOL from ${fromPubkey} to ${toPubkey}`
      );

      const tx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey,
          toPubkey,
          lamports: amount * LAMPORTS_PER_SOL
        })
      );

      tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      tx.feePayer = fromPubkey;
      const base64 = tx.serializeMessage().toString('base64');

      // sign using the well-typed solana end point (which requires a base64 serialized Message)
      let resp = await userClient.apiClient.signSolana(fromAddress, {
        message_base64: base64
      });
      const sig = await resp.totpApprove(
        userClient,
        authenticator.generate(totpSecret)
      );

      // conver the signature 0x... to bytes
      const sigBytes = Buffer.from(sig.data().signature.slice(2), 'hex');

      // add signature to transaction
      tx.addSignature(fromPubkey, sigBytes);

      // send transaction
      const txHash = await connection.sendRawTransaction(tx.serialize());
      console.log(`txHash: ${txHash}`);
    } catch (err) {
      throw Error('Error sending transaction: ' + err);
    }
  }
};
