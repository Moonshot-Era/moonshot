import { redirect } from 'next/navigation';
import axios from 'axios';

import { createServerClient } from '@/supabase/server';

import { HomeContent } from '@/components/HomeContent/HomeContent';
import { Header } from '@/components/Header/Header';
import { WalletPortfolioNormilizedType } from '@/services/birdeye/getWalletPortfolio';
import { cookies } from 'next/headers';

export default async function Index() {
  const supabaseClient = createServerClient();

  const user = (await supabaseClient.auth.getSession()).data.session?.user;

  if (!user) {
    redirect('/login');
  }

  const oidc = cookies()?.get('gc')?.value;

  const { data: walletData } = await axios.post(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/cube/get-wallet`,
    {
      oidc,
    }
  );

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
