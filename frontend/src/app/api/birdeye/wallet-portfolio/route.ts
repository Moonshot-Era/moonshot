import { NextResponse } from 'next/server';
import { getWalletPortfolio } from '@/services/birdeye/getWalletPortfolio';
import { WalletPortfolioType } from '@/@types/birdeye';

export async function POST(request: Request) {
  const data = await request.json();

  const walletAddress = data?.walletAddress;

  const walletPortfolio: WalletPortfolioType | {} = await getWalletPortfolio(
    walletAddress
  );

  return NextResponse.json({ walletPortfolio });
}
