import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { sendNativeTransaction } from '@/services/solana/sendNativeTransaction';
import { sendTokensTransaction } from '@/services/solana/sendTokensTransaction';
import { isSolanaAddress } from '@/helpers/helpers';

export async function POST(request: Request) {
  const response = await request.json();
  const oidc = cookies()?.get('pt')?.value;

  if (isSolanaAddress(response.tokenAddress)) {
    await sendNativeTransaction(
      oidc!,
      response.fromAddress,
      response.toAddress,
      response.amount
    );
  } else {
    await sendTokensTransaction(
      oidc!,
      response.fromAddress,
      response.toAddress,
      +response.amount,
      response.tokenAddress,
      response.tokenDecimals
    );
  }

  return NextResponse.json({});
}
