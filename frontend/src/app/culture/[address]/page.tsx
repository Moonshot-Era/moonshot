import axios from 'axios';

import { Header } from '@/components/Header/Header';
import { checkProtectedRoute } from '@/utils/checkProtectedRoute';
import { CultureItem } from '@/components/CultureItem/CultureItem';
import { CultureError } from '@/components/CultureError/CultureError';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { Suspense } from 'react';

export default async function CultureItemPage({
  params,
  searchParams
}: ServerPageProps<{ address: string }>) {
  const user = await checkProtectedRoute(searchParams, false);

  const tokenAddress = params?.address;

  const { data: tokenInfo } = await axios.post(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/get-token-info`,
    {
      tokenAddress
    }
  );

  return (
    <>
      <Header isPublic={!user?.id} />
      <Suspense fallback={<Skeleton variant="culture" />}>
        {tokenInfo?.name ? (
          <CultureItem
            isPublic={!user?.id}
            tokenAddress={tokenAddress}
            tokenInfo={tokenInfo}
          />
        ) : (
          <CultureError />
        )}
      </Suspense>
    </>
  );
}
