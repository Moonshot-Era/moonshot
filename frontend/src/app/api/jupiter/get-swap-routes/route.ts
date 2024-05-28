import { NextResponse } from 'next/server';
import { getSwapRoutes } from '@/services/jupiter/getSwapRoutes';

export async function POST(request: Request) {
  const data = await request.json();

  const response = await getSwapRoutes(
    data.inputMint,
    data.outputMint,
    data.amount,
    data.slippageBps,
  );

  return NextResponse.json({ swapRoutes: response.data });
}
