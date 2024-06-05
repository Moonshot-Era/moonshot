import { ExploreContent } from '@/components/ExploreContent/ExploreContent';
import { Header } from '@/components/Header/Header';
import { checkProtectedRoute } from '@/utils/checkProtectedRoute';

export default async function Explore({ searchParams }: ServerPageProps) {
  const user = await checkProtectedRoute(searchParams);

  return (
    <>
      <Header isPublic={!user?.id} />
      <ExploreContent />;
    </>
  );
}
