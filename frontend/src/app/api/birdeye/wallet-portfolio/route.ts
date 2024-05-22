import { NextResponse } from 'next/server';
import { getWalletPortfolio } from '@/services/birdeye/getWalletPortfolio';
import { WalletPortfolioType } from '@/@types/birdeye';

export async function POST(request: Request) {
  const response = await request.json();
  const walletPortfolio: WalletPortfolioType | {} = await getWalletPortfolio(
    response?.walletAddress
  );

  return NextResponse.json({ walletPortfolio });
}
