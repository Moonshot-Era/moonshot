import axios from 'axios';
import { CultureItem } from '@/components/CultureItem/CultureItem';
import { Header } from '@/components/Header/Header';

export default async function PublicItemPage({
  searchParams,
}: ServerPageProps) {
  const tokenAddress = searchParams?.tokenAddress;

  const { data: tokenData } = await axios.post(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/birdeye/get-token-overview`,
    {
      tokenAddress,
    }
  );

  return (
    <>
      <Header />
      <CultureItem isPublic tokenItem={tokenData?.token} />
    </>
  );
}
