import { NextResponse } from 'next/server';
import { validateIsSolanaWallet } from '@/services/solana/validateIsSolanaWallet';

export async function POST(request: Request) {
  const response = await request.json();

  const isSolanaWallet = await validateIsSolanaWallet(response.wallet).catch(
    (err) => console.log('Error:', err)
  );
  if (!isSolanaWallet) {
    return NextResponse.json(false);
  }
  return NextResponse.json({ isSolanaWallet });
}
