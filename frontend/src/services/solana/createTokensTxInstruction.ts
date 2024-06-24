import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction
} from '@solana/web3.js';

import {
  createTransferCheckedInstruction,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  getAccount
} from '@solana/spl-token';

interface Props {
  fromPublicKey: PublicKey;
  toAddress: string;
  tokenAddress: string;
  amount: number;
  tokenDecimals: number;
  tokenSymbol: string;
  tx: Transaction;
  connection: Connection;
}

export const createTokensTxInstruction = async ({
  fromPublicKey,
  toAddress,
  tokenAddress,
  amount,
  tokenDecimals,
  tokenSymbol,
  tx,
  connection
}: Props) => {
  const toPubkey = new PublicKey(toAddress);

  const mintPubkey = new PublicKey(tokenAddress);

  console.log(
    `Transferring ${amount} ${tokenSymbol} from ${fromPublicKey} to ${toPubkey}`
  );

  // Get the associated token accounts for the sender and receiver
  const fromTokenAccount = await getAssociatedTokenAddress(
    mintPubkey, // mint
    fromPublicKey, // from owner
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
        fromPublicKey,
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
      fromPublicKey, // from's owner
      Math.trunc(
        amount * (10 ** +tokenDecimals / LAMPORTS_PER_SOL) * LAMPORTS_PER_SOL
      ), // amount
      tokenDecimals // decimals
    )
  );
};
