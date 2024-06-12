import { HomeContent } from '@/components/HomeContent/HomeContent';
import { Header } from '@/components/Header/Header';
import { checkProtectedRoute } from '@/utils/checkProtectedRoute';

export default async function Home({ searchParams }: ServerPageProps) {
  const user = await checkProtectedRoute(searchParams);

  return (
    <>
      <Header isPublic={!user?.id} />
      <HomeContent userId={user?.id} />
    </>
  );
}
