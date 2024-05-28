import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getWalletPortfolio } from '@/services/birdeye/getWalletPortfolio';
import { WalletPortfolioType } from '@/@types/birdeye';
import { getUserWallet } from '@/services';

export async function POST(request: Request) {
  const data = await request.json();
  const oidc = cookies()?.get('pt')?.value;

  const walletAddress = data?.walletAddress || await getUserWallet(oidc!);

  const walletPortfolio: WalletPortfolioType | {} = await getWalletPortfolio(
    walletAddress,
  );

  return NextResponse.json({ walletPortfolio });
}
