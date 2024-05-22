import { redirect } from 'next/navigation';
import { createServerClient } from '@/supabase/server';

import { HomeContent } from '@/components/HomeContent/HomeContent';
import { Header } from '@/components/Header/Header';
import { SplashScreen } from '@/components/SplashScreen/SplashScreen';
import axios from 'axios';

export default async function Index() {
  const supabaseClient = createServerClient();

  const user = (await supabaseClient.auth.getSession()).data.session?.user;

  if (!user) {
    redirect('/login');
  }

  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/birdeye/wallet-portfolio`,
    { walletAddress: '' }
  );

  return (
    <>
      <Header />
      <HomeContent portfolio={data?.walletPortfolio} />
    </>
  );
}
