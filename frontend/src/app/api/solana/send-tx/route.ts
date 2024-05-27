import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { sendTransaction } from '@/services/solana/sendTransaction';
// import { sendTransactionWrappedSol } from '@/services/solana/sendTransactionWrappedSol';

export async function POST(request: Request) {
  const response = await request.json();
  const oidc = cookies()?.get('pt')?.value;

  const tx = await sendTransaction(
    oidc!,
    response.fromAddress,
    response.toAddress,
    response.amount
  );

  // const tx = await sendTransactionxWrappedSol(
  //   oidc!,
  //   response.fromAddress,
  //   response.toAddress,
  //   response.amount
  // );

  return NextResponse.json({ tx });
}
