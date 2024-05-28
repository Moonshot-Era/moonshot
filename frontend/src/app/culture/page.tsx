import { ShareModal } from '@/components/ShareModal/ShareModal';
import { ROUTES } from '@/utils';
import { checkProtectedRoute } from '@/utils/checkProtectedRoute';
import { redirect } from 'next/navigation';

export default async function Culture({ searchParams }: ServerPageProps) {
  await checkProtectedRoute(searchParams);
  redirect(ROUTES.home);
}
