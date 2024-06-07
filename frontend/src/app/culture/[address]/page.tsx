import axios from 'axios';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { Header } from '@/components/Header/Header';
import { checkProtectedRoute } from '@/utils/checkProtectedRoute';
import { CultureItem } from '@/components/CultureItem/CultureItem';
import { CultureError } from '@/components/CultureError/CultureError';
import { axiosBrowserClient } from '@/services/axios/axiosBrowserClient';

export default async function CultureItemPage({
  params,
  searchParams
}: ServerPageProps<{ address: string }>) {
  let walletAddress = '';
  const user = await checkProtectedRoute(searchParams, false);
  const oidc = cookies()?.get('pt')?.value;

  const tokenAddress = params?.address;
  const { data: tokenOverview } = await axios.post(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/get-token-overview`,
    {
      tokenAddress
    }
  );
  const { data: tokenInfo } = await axios.post(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/get-token-info`,
    {
      tokenAddress
    }
  );

  if (user?.id) {
    const { data: walletData } = await axios.post(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/get-wallet`,
      {
        oidc
      }
    );
    walletAddress = walletData?.wallet;
    if (!walletData?.wallet) {
      redirect('/logout');
    }
  }

  return (
    <>
      <Header isPublic={!user?.id} />
      {tokenInfo?.name ? (
        <CultureItem
          isPublic={!user?.id}
          tokenData={tokenOverview}
          tokenInfo={tokenInfo}
          walletAddress={walletAddress}
        />
      ) : (
        <CultureError />
      )}
    </>
  );
}
