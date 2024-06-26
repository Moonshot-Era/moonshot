import { NextResponse } from 'next/server';
import { getSwapRoutes } from '@/services/jupiter/getSwapRoutes';

export async function POST(request: Request) {
  const data = await request.json();

  let swapResp;

  try {
    swapResp = await getSwapRoutes(
      data.inputMint,
      data.outputMint,
      data.amount,
      data.slippageBps
    );
  } catch (err: any) {
    return NextResponse.json(
      { errorMessage: err?.message ?? '' },
      { status: 400 }
    );
  }

  return NextResponse.json({ swapRoutes: swapResp.data });
}
