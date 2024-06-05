import axios from 'axios';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { HomeContent } from '@/components/HomeContent/HomeContent';
import { Header } from '@/components/Header/Header';
import { checkProtectedRoute } from '@/utils/checkProtectedRoute';

export default async function Home({ searchParams }: ServerPageProps) {
  const user = await checkProtectedRoute(searchParams);

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
      <Header isPublic={!user?.id} />
      <HomeContent walletAddress={walletData?.wallet} userId={user?.id} />
    </>
  );
}
