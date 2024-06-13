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

  return (
    <>
      <Header isPublic={!user?.id} />
      <SettingsContent />
    </>
  );
}
