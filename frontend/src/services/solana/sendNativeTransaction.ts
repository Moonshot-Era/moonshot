import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction
} from '@solana/web3.js';

import { authenticator } from 'otplib';

import { getUserSessionClient } from '../cubeSigner';
import { getMfaSecret } from '../helpers/getMfaSecret';

export const sendNativeTransaction = async (
  oidcToken: string,
  fromAddress: string,
  toAddress: string,
  amount: number
) => {
  const totpSecret = await getMfaSecret();
  const userClient = await getUserSessionClient(oidcToken);

  const connection = new Connection(
    process.env.SOLANA_RPC_PROVIDER,
    'confirmed'
  );

  const fromPubkey = new PublicKey(fromAddress);
  const toPubkey = new PublicKey(toAddress);

  console.log(`Transferring ${amount} SOL from ${fromPubkey} to ${toPubkey}`);

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
};
