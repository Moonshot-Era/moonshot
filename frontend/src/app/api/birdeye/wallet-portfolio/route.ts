import { NextResponse } from 'next/server';
import { getWalletPortfolio } from '@/services/birdeye/getWalletPortfolio';

export async function POST(request: Request) {
  const response = await request.json();
  const walletPortfolio = await getWalletPortfolio(response?.walletAddress);

  return NextResponse.json({ walletPortfolio });
}
