import axios from 'axios';
import { checkProtectedRoute } from '@/utils/checkProtectedRoute';
import { CultureItem } from '@/components/CultureItem/CultureItem';

export default async function CultureItemPage({
  searchParams,
}: ServerPageProps) {
  await checkProtectedRoute(searchParams);
  const tokenAddress = searchParams?.tokenAddress;

  const { data: tokenData } = await axios.post(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/birdeye/get-token-overview`,
    {
      tokenAddress,
    }
  );

  return <CultureItem tokenItem={tokenData?.token} />;
}
