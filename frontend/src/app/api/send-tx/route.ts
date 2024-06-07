import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { sendNativeTransaction } from '@/services/solana/sendNativeTransaction';
import { sendTokensTransaction } from '@/services/solana/sendTokensTransaction';
import { isSolanaAddress } from '@/helpers/helpers';
import { setMfaSecret } from '@/services/helpers/setMfaSecret';
import { getMfaSecret } from '@/services/helpers/getMfaSecret';

export async function POST(request: Request) {
  const response = await request.json();
  const oidc = cookies()?.get('pt')?.value;

  // await setMfaSecret('SBCXRKMQOSFA6QTRGGVQR4BDWVPNQN5Y');
  // const secret = await getMfaSecret();
  // console.log('debug > secret===', secret);

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
  } catch (err) {
    throw err;
  }
  return NextResponse.json({ withdrawalResp });
}
