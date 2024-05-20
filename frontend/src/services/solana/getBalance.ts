import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import {
  NATIVE_MINT,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  createSyncNativeInstruction,
  getAccount,
  AccountLayout,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';

import { getTokenAccounts } from './getTokensAccountList';

export const getSolanaBalance = async (fromAddress: string) => {
  try {
    const connection = new Connection(
      process.env.SOLANA_RPC_PROVIDER,
      'confirmed'
    );
    const fromPubkey = new PublicKey(fromAddress);

    const balance = await connection.getBalance(fromPubkey);

    return balance / LAMPORTS_PER_SOL;
  } catch (err) {
    throw Error('Error retrieving balance');
  }
};
