import axios from 'axios';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { HomeContent } from '@/components/HomeContent/HomeContent';
import { Header } from '@/components/Header/Header';
import { checkProtectedRoute } from '@/utils/checkProtectedRoute';
import { createBrowserClient } from '@/supabase/client';

export default async function Home({ searchParams }: ServerPageProps) {
  await checkProtectedRoute(searchParams);
  const supabaseClient = createBrowserClient();
  const { data: sessionData } = await supabaseClient.auth.getSession();

  const userId = sessionData.session?.user?.id;
  const oidc = cookies()?.get('pt')?.value;

  const { data: walletData } = await axios.post(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/cube/get-wallet`,
    {
      oidc
    }
  );

  if (!walletData?.wallet) {
    redirect('/logout');
  }

  return (
    <>
      <HomeContent walletAddress={walletData?.wallet} userId={userId} />
    </>
  );
}
