import { NextResponse } from 'next/server';
import { sendNativeTransaction } from '@/services/solana/sendNativeTransaction';
import { sendTokensTransaction } from '@/services/solana/sendTokensTransaction';
import { isSolanaAddress } from '@/helpers/helpers';

export async function POST(request: Request) {
  const response = await request.json();

  let withdrawalResp;
  try {
    if (isSolanaAddress(response.tokenAddress)) {
      withdrawalResp = await sendNativeTransaction(
        response.fromAddress,
        response.toAddress,
        response.amount
      );
    } else {
      withdrawalResp = await sendTokensTransaction(
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
  return NextResponse.json({ withdrawalResp });
}
