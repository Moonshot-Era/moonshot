import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import { NextResponse } from 'next/server';
import { validateIsSolanaWallet } from '@/services/solana/validateIsSolanaWallet';

export async function POST(request: Request) {
  const reqData = await request.json();
  const change = await (new Promise((resolve, reject) => {
    try {
      const connection = new Connection(
        clusterApiUrl('mainnet-beta'),
        {
          commitment: "confirmed",
          wsEndpoint: `${process.env.HELIUS_URL_API?.replace('https', 'wss')}/?api-key=${process.env.HELIUS_API_KEY}`
        },
      );
  
      const publicKey = new PublicKey(reqData.walletAddress!);
  
      const subscriptionID = connection.onAccountChange(
        publicKey,
        (updatedAccountInfo, context) => {
          resolve(updatedAccountInfo);
        },
        "confirmed",
      );
    } catch (error) {
      reject(error);
      console.log('error while connecting to wallet', error);
    }
  }));

  return NextResponse.json(change);
};
