import { NextResponse } from 'next/server';
import { WalletPortfolioType } from '@/@types/birdeye';
import { getOhlcvData } from '@/services/birdeye/getOhlcv';

export async function POST(request: Request) {
  const data = await request.json();

  const tokenAddress = data?.tokenAddress;

  const ohlcvData: WalletPortfolioType | {} = await getOhlcvData(tokenAddress);

  return NextResponse.json({ ohlcvData });
}
