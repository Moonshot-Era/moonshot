import { Suspense } from 'react';

import { ExploreContent } from '@/components/ExploreContent/ExploreContent';
import { Header } from '@/components/Header/Header';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { checkProtectedRoute } from '@/utils/checkProtectedRoute';

export default async function Explore({ searchParams }: ServerPageProps) {
  const user = await checkProtectedRoute(searchParams);

  return (
    <>
      <Header isPublic={!user?.id} />
      <Suspense fallback={<Skeleton variant="explore" />}>
        <ExploreContent />;
      </Suspense>
    </>
  );
}
