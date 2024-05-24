import axios from 'axios';

import { HomeContent } from '@/components/HomeContent/HomeContent';
import { Header } from '@/components/Header/Header';
import { WalletPortfolioNormilizedType } from '@/services/birdeye/getWalletPortfolio';
import { checkProtectedRoute } from '@/utils/checkProtectedRoute';

export default async function Index({ searchParams }: ServerPageProps) {
  await checkProtectedRoute(searchParams);

  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/birdeye/wallet-portfolio`,
    { walletAddress: '' },
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
