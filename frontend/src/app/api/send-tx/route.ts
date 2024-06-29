import { NextResponse } from 'next/server';
import { sendNativeTransaction } from '@/services/solana/sendNativeTransaction';
import { sendTokensTransaction } from '@/services/solana/sendTokensTransaction';
import { isSolanaAddress } from '@/helpers/helpers';

export async function POST(request: Request) {
  const response = await request.json();

  let txHash;
  try {
    if (isSolanaAddress(response.tokenAddress)) {
      txHash = await sendNativeTransaction(
        response.fromAddress,
        response.toAddress,
        response.amount
      );
    } else {
      txHash = await sendTokensTransaction(
        response.fromAddress,
        response.toAddress,
        +response.amount,
        response.tokenAddress,
        response.tokenDecimals
      );
    }
  } catch (err: any) {
    return NextResponse.json(
      { errorMessage: err?.message ?? '' },
      { status: 400 }
    );
  }
  return NextResponse.json({ txHash });
}
