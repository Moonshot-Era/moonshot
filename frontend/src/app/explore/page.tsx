import axios from 'axios';
import { checkProtectedRoute } from '@/utils/checkProtectedRoute';
import { ExploreContent } from '@/components/ExploreContent/ExploreContent';

export default async function Explore({ searchParams }: ServerPageProps) {
  await checkProtectedRoute(searchParams);

  return <ExploreContent />;
}
