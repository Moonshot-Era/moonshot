import { NextResponse } from 'next/server';
import { getUserWallet } from '@/services';
import { getSolanaBalance } from '@/services/solana';

export async function POST(request: Request) {
  const data = await request.json();

  return NextResponse.json({});
}
