import { Header } from '@/components/Header/Header';
import { checkProtectedRoute } from '@/utils/checkProtectedRoute';
import { SettingsContent } from '@/components/SettingsContent/SettingsContent';

export default async function Settings({ searchParams }: ServerPageProps) {
  const user = await checkProtectedRoute(searchParams);

  return (
    <>
      <Header isPublic={!user?.id} />
      <SettingsContent />
    </>
  );
}
