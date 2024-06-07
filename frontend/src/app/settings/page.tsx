import axios from 'axios';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { Header } from '@/components/Header/Header';
import { checkProtectedRoute } from '@/utils/checkProtectedRoute';
import { SettingsContent } from '@/components/SettingsContent/SettingsContent';

export default async function Settings({ searchParams }: ServerPageProps) {
  const user = await checkProtectedRoute(searchParams);
  const cookiesAll = cookies()?.getAll();

  const oidc = cookies()?.get('pt')?.value;
  const { data: walletData } = await axios.post(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/get-wallet`,
    {
      oidc
    },
    {
      headers: {
        Cookie: encodeURI(
          cookiesAll.map((cookie) => `${cookie.name}=${cookie.value}`).join(';')
        )
      }
    }
  );

  if (!walletData?.wallet) {
    redirect('/logout');
  }

  return (
    <>
      <Header isPublic={!user?.id} />
      <SettingsContent walletAddress={walletData?.wallet} />
    </>
  );
}
