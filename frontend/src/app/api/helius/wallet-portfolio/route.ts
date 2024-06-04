import { NextResponse } from 'next/server';
import { WalletPortfolioType } from '@/@types/birdeye';
import { getWalletPortfolio } from '@/services/helius/getWalletPortfolio';

export async function POST(request: Request) {
  const data = await request.json();

  const walletAddress = data?.walletAddress;

  const walletPortfolio: WalletPortfolioType | {} = await getWalletPortfolio(
    walletAddress
  );

  return NextResponse.json({ walletPortfolio });
}
