import { NextResponse } from 'next/server';
import { WalletPortfolioType } from '@/@types/birdeye';
import { getWalletPortfolio } from '@/services/helius/getWalletPortfolio';

export async function POST(request: Request) {
  const data = await request.json();

  const walletAddress =
    data?.walletAddress || 'B8xaui7xwQSZmuPwjem7Ka5Qobag7khJHNCPWzDpmXrD';

  const walletPortfolio: WalletPortfolioType | {} = await getWalletPortfolio(
    walletAddress
  );
  console.log('debug > walletPortfolio===', walletPortfolio);
  return NextResponse.json({ walletPortfolio });
}
