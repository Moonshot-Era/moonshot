import { NextResponse } from 'next/server';
import { swapTokens } from '@/services/jupiter/swapTokens';

export async function POST(request: Request) {
  const data = await request.json();

  try {
    const txid = await swapTokens(data.swapRoutes, data.feeData);

    return NextResponse.json({
      txid
    });
  } catch (err) {
    return NextResponse.json({ error: `${err}` });
  }
}
