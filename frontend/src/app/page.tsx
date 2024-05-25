import axios from 'axios';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { HomeContent } from '@/components/HomeContent/HomeContent';
import { Header } from '@/components/Header/Header';
import { WalletPortfolioNormilizedType } from '@/services/birdeye/getWalletPortfolio';
import { checkProtectedRoute } from '@/utils/checkProtectedRoute';

export default async function Home({ searchParams }: ServerPageProps) {
  await checkProtectedRoute(searchParams);

  const oidc = cookies()?.get('pt')?.value;

  const { data: walletData } = await axios.post(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/cube/get-wallet`,
    {
      oidc,
    }
  );
  console.log('debug > wallet===', walletData);
  if (!walletData?.wallet) {
    redirect('/login');
  }

  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/birdeye/wallet-portfolio`,
    { walletAddress: walletData?.wallet }
  );

  return (
    <>
      <Header />
      <HomeContent
        portfolio={data?.walletPortfolio as WalletPortfolioNormilizedType}
      />
    </>
  );
}
