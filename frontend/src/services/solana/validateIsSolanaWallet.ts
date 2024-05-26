import { PublicKey } from '@solana/web3.js';

export const validateIsSolanaWallet = async (address: string) => {
  try {
    const owner = new PublicKey(address);

    return PublicKey.isOnCurve(owner.toBytes());
  } catch (err) {
    throw err;
  }
};
