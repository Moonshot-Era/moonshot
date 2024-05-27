import axios from 'axios';
import { checkProtectedRoute } from '@/utils/checkProtectedRoute';
import { ExploreContent } from '@/components/ExploreContent/ExploreContent';

export default async function Explore({ searchParams }: ServerPageProps) {
  await checkProtectedRoute(searchParams);

  const { data: trendingPoolsData } = await axios.post(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/gecko/get-trending-pools`
  );
  return (
    <ExploreContent trendingPools={trendingPoolsData?.trendingPools?.data} />
  );
}
