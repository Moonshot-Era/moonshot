import { HomeContent } from '@/components/HomeContent/HomeContent';
import { Header } from '@/components/Header/Header';
import { checkProtectedRoute } from '@/utils/checkProtectedRoute';
import { Suspense } from 'react';
import { Skeleton } from '@/components/Skeleton/Skeleton';

export default async function Home({ searchParams }: ServerPageProps) {
  const user = await checkProtectedRoute(searchParams);

  return (
    <>
      <Header isPublic={!user?.id} />
      <Suspense fallback={<Skeleton variant="home" />}>
        <HomeContent suserId={user?.id} />
      </Suspense>
    </>
  );
}
