import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { swapTokens } from '@/services/jupiter/swapTokens';

export async function POST(request: Request) {
  const data = await request.json();
  const oidc = cookies()?.get('pt')?.value;

  if (!oidc) {
    return NextResponse.json({ error: { statusText: 'Forbidden' } });
  }

  try {
    const txid = await swapTokens(oidc!, data.swapRoutes, data.feeData);

    return NextResponse.json({
      txid
    });
  } catch (err) {
    return NextResponse.json({ error: `${err}` });
  }
}
