import axios from 'axios';
import { cookies } from 'next/headers';

import { CultureItem } from '@/components/CultureItem/CultureItem';
import { checkProtectedRoute } from '@/utils/checkProtectedRoute';
import { CultureError } from '@/components/CultureError/CultureError';

export default async function CultureItemPage({
  params,
  searchParams
}: ServerPageProps<{ address: string }>) {
  const user = await checkProtectedRoute(searchParams, false);
  const oidc = cookies()?.get('pt')?.value;

  const tokenAddress = params?.address;

  const { data: token } = await axios.post(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/gecko/get-token-data`,
    {
      tokenAddress
    }
  );

  const { data: tokenData } = await axios.post(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/helius/get-token-overview`,
    {
      tokenAddress
    }
  );

  const { data: walletData } = await axios.post(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/cube/get-wallet`,
    {
      oidc
    }
  );

  return (
    <>
      {tokenData?.token.name ? (
        <CultureItem
          isPublic={!user?.id}
          tokenData={token}
          tokenItem={tokenData?.token}
          walletAddress={walletData?.wallet}
        />
      ) : (
        <CultureError />
      )}
    </>
  );
}
