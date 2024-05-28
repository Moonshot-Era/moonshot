import axios from 'axios';
import { checkProtectedRoute } from '@/utils/checkProtectedRoute';
import { CultureItem } from '@/components/CultureItem/CultureItem';

export default async function CultureItemPage({
  searchParams,
}: ServerPageProps) {
  await checkProtectedRoute(searchParams);

  const { data: trendingPoolsData } = await axios.post(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/gecko/get-trending-pools`
  );

  return <CultureItem trendingPoolItem={trendingPoolsData} />;
}
