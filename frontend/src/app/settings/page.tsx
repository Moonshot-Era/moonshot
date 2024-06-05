import { Header } from '@/components/Header/Header';
import { SettingsContent } from '@/components/SettingsContent/SettingsContent';
import { checkProtectedRoute } from '@/utils/checkProtectedRoute';

export default async function Settings({ searchParams }: ServerPageProps) {
  const user = await checkProtectedRoute(searchParams);

  return (
    <>
      <Header isPublic={!user?.id} />
      <SettingsContent />;
    </>
  );
}
