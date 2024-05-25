import { ShareModal } from '@/components/ShareModal/ShareModal';
import { checkProtectedRoute } from '@/utils/checkProtectedRoute';

export default async function Culture({ searchParams }: ServerPageProps) {
  await checkProtectedRoute(searchParams);

  return <ShareModal />;
}
