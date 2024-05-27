import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

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
