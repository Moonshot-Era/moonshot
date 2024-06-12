import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { swapTokens } from '@/services/jupiter/swapTokens';
import { sendTokensTransaction } from '@/services/solana/sendTokensTransaction';
import {
  MOONSHOT_FEE,
  MOONSHOT_WALLET_ADDRESS,
  REF_FEE,
  REF_WALLET_ADDRESS
} from '@/utils';
import { isSolanaAddress } from '@/helpers/helpers';
import { sendNativeTransaction } from '@/services/solana/sendNativeTransaction';

export async function POST(request: Request) {
  const data = await request.json();
  const oidc = cookies()?.get('pt')?.value;

  if (!oidc) {
    return NextResponse.next({
      request: {
        headers: request.headers
      }
    });
  }

  const txid = await swapTokens(oidc!, data.swapRoutes);
  if (txid) {
    if (isSolanaAddress(data.feeData.tokenAddress)) {
      await sendNativeTransaction(
        oidc!,
        data.feeData.fromAddress,
        MOONSHOT_WALLET_ADDRESS,
        +data.feeData.amount * MOONSHOT_FEE
      );
      await sendNativeTransaction(
        oidc!,
        data.feeData.fromAddress,
        REF_WALLET_ADDRESS,
        +data.feeData.amount * REF_FEE
      );
    } else {
      await sendTokensTransaction(
        oidc!,
        data.feeData.fromAddress,
        MOONSHOT_WALLET_ADDRESS,
        +data.feeData.amount * MOONSHOT_FEE,
        data.feeData.tokenAddress,
        data.feeData.tokenDecimals
      );
      await sendTokensTransaction(
        oidc!,
        data.feeData.fromAddress,
        REF_WALLET_ADDRESS,
        +data.feeData.amount * REF_FEE,
        data.feeData.tokenAddress,
        data.feeData.tokenDecimals
      );
    }
  }

  return NextResponse.json({
    txid
  });
}
