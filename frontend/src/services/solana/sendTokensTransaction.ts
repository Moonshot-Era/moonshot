import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction
} from '@solana/web3.js';

import { getUserSessionClient } from '../cubeSigner';
import {
  createTransferCheckedInstruction,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  getAccount
} from '@solana/spl-token';

import { authenticator } from 'otplib';
import { getMfaSecret } from '../helpers/getMfaSecret';

export const sendTokensTransaction = async (
  fromAddress: string,
  toAddress: string,
  amount: number,
  tokenAddress: string,
  tokenDecimals: number
) => {
  const totpSecret = await getMfaSecret();
  const userClient = await getUserSessionClient();

  const connection = new Connection(
    process.env.SOLANA_RPC_PROVIDER,
    'confirmed'
  );

  const fromPubkey = new PublicKey(fromAddress);
  const toPubkey = new PublicKey(toAddress);

  const mintPubkey = new PublicKey(tokenAddress);

  console.log(`Transferring ${amount} from ${fromPubkey} to ${toPubkey}`);

  // Get the associated token accounts for the sender and receiver
  const fromTokenAccount = await getAssociatedTokenAddress(
    mintPubkey, // mint
    fromPubkey, // from owner
    true, // allow owner off curve
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  const toTokenAccount = await getAssociatedTokenAddress(
    mintPubkey, // mint
    toPubkey, // to owner
    true, // allow owner off curve
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  let tokenAccount;
  const tx = new Transaction();
  try {
    const res = await getAccount(connection, toTokenAccount);
    if (res) {
      tokenAccount = res;
    }
  } catch (err) {
    console.log(`Token account error: ${err}`);
  }

  if (!tokenAccount) {
    tx.add(
      createAssociatedTokenAccountInstruction(
        fromPubkey,
        toTokenAccount,
        toPubkey,
        mintPubkey,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      )
    );
  }

  tx.add(
    createTransferCheckedInstruction(
      fromTokenAccount, // from
      mintPubkey, // mint
      toTokenAccount, // to
      fromPubkey, // from's owner
      amount * (10 ** +tokenDecimals / LAMPORTS_PER_SOL) * LAMPORTS_PER_SOL, // amount
      tokenDecimals // decimals
    )
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
  // @ts-ignore
  const txHash = await connection.sendRawTransaction(tx.serialize());

  return txHash;
};
