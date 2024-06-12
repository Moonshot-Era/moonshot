import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { sendNativeTransaction } from '@/services/solana/sendNativeTransaction';
import { sendTokensTransaction } from '@/services/solana/sendTokensTransaction';
import { isSolanaAddress } from '@/helpers/helpers';

export async function POST(request: Request) {
  const response = await request.json();
  const oidc = cookies()?.get('pt')?.value;

  let withdrawalResp;
  try {
    if (isSolanaAddress(response.tokenAddress)) {
      withdrawalResp = await sendNativeTransaction(
        oidc!,
        response.fromAddress,
        response.toAddress,
        response.amount
      );
    } else {
      withdrawalResp = await sendTokensTransaction(
        oidc!,
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
