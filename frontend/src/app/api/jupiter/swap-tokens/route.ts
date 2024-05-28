import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { swapTokens } from '@/services/jupiter/swapTokens';
import { getUserWallet } from '@/services';

export async function POST(request: Request) {
  const data = await request.json();
  const oidc = cookies()?.get('pt')?.value;

  if (!oidc) {
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }

  const txid = await swapTokens(oidc!, data.swapRoutes);

  return NextResponse.json({
    txid,
  });
}
