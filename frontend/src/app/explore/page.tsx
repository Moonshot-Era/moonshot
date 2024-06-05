import { ExploreContent } from '@/components/ExploreContent/ExploreContent';
import { checkProtectedRoute } from '@/utils/checkProtectedRoute';

export default async function Explore({ searchParams }: ServerPageProps) {
  await checkProtectedRoute(searchParams);

  return <ExploreContent />;
}
