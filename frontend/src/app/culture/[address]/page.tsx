import axios from 'axios';

import { Header } from '@/components/Header/Header';
import { checkProtectedRoute } from '@/utils/checkProtectedRoute';
import { CultureItem } from '@/components/CultureItem/CultureItem';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { Suspense } from 'react';

export default async function CultureItemPage({
  params,
  searchParams
}: ServerPageProps<{ address: string }>) {
  const user = await checkProtectedRoute(searchParams, false);

  const tokenAddress = params?.address;

  return (
    <>
      <Header isPublic={!user?.id} />
      <Suspense fallback={<Skeleton variant="culture" />}>
        <CultureItem isPublic={!user?.id} tokenAddress={tokenAddress} />
      </Suspense>
    </>
  );
}
