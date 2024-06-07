import { Header } from '@/components/Header/Header';
import { SettingsContent } from '@/components/SettingsContent/SettingsContent';
import { checkProtectedRoute } from '@/utils/checkProtectedRoute';
import axios from 'axios';
import { cookies } from 'next/headers';

export default async function Settings({ searchParams }: ServerPageProps) {
  const user = await checkProtectedRoute(searchParams);

  const oidc = cookies()?.get('pt')?.value;
  const { data: walletData } = await axios.post(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/get-wallet`,
    {
      oidc
    }
  );

  return (
    <>
      <Header isPublic={!user?.id} />
      <SettingsContent walletAddress={walletData?.wallet} />
    </>
  );
}
