import axios from 'axios';
import { cookies } from 'next/headers';

import { CultureItem } from '@/components/CultureItem/CultureItem';
import { checkProtectedRoute } from '@/utils/checkProtectedRoute';

export default async function CultureItemPage({
  searchParams,
}: ServerPageProps) {
  await checkProtectedRoute(searchParams);
  const tokenAddress = searchParams?.tokenAddress;
  const oidc = cookies()?.get('pt')?.value;

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
      tokenItem={tokenData?.token}
      walletAddress={walletData?.wallet}
    />
  );
}
