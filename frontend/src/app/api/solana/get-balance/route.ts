import { NextResponse } from 'next/server';
import { getSolanaBalance } from '@/services/solana';

export async function POST(request: Request) {
  const response = await request.json();

  const balance = await getSolanaBalance(response.wallet);

  return NextResponse.json({ balance });
}
