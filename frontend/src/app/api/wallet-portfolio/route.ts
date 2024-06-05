import { WalletPortfolioType } from '@/@types/helius';
import { getWalletPortfolio } from '@/services/helius/getWalletPortfolio';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const data = await request.json();

  const walletAddress = data?.walletAddress;

  const walletPortfolio: WalletPortfolioType | {} = await getWalletPortfolio(
    walletAddress
  );
  return NextResponse.json({ walletPortfolio });
}
