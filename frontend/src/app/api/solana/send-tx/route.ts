import { NextResponse } from 'next/server';
import { sendTransaction } from '@/services/solana/sendTransaction';

export async function POST(request: Request) {
  const response = await request.json();

  const tx = await sendTransaction(
    response.oidcToken,
    response.fromAddress,
    response.toAddress,
    response.amount
  );

  return NextResponse.json({ tx });
}
