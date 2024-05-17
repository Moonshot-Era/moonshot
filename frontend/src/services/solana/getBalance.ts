import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

export const getSolanaBalance = async (fromAddress: string) => {
  try {
    const connection = new Connection(
      process.env.SOLANA_RPC_PROVIDER,
      'confirmed'
    );
    const fromPubkey = new PublicKey(fromAddress);

    // const airdropSignature = await connection.requestAirdrop(
    //   fromPubkey,
    //   LAMPORTS_PER_SOL
    // );
    // console.log('Got an airdrop!', airdropSignature);

    const balance = await connection.getBalance(fromPubkey);

    return balance;
  } catch (err) {
    throw Error('Error retrieving balance');
  }
};
