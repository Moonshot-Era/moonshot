import axios from 'axios';
import { cookies, headers } from 'next/headers';

import { CultureItem } from '@/components/CultureItem/CultureItem';
import { checkProtectedRoute } from '@/utils/checkProtectedRoute';

export default async function CultureItemPage({
  params,
  searchParams,
}: ServerPageProps<{ address: string }>) {
  const user = await checkProtectedRoute(searchParams, false);
  const oidc = cookies()?.get('pt')?.value;

  const tokenAddress = params?.address;

  const { data: tokenData } = await axios.post(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/birdeye/get-token-overview`,
    {
      tokenAddress,
    }
  );

  const { data: walletData } = await axios.post(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/cube/get-wallet`,
    {
      oidc,
    }
  );

  return (
    <CultureItem
      isPublic={!user?.id}
      tokenItem={tokenData?.token}
      walletAddress={walletData?.wallet}
    />
  );
}
