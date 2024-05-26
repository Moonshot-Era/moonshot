import { SettingsContent } from '@/components/SettingsContent/SettingsContent';
import { checkProtectedRoute } from '@/utils/checkProtectedRoute';

export default async function Settings({ searchParams }: ServerPageProps) {
  await checkProtectedRoute(searchParams);

  return <SettingsContent />;
}
