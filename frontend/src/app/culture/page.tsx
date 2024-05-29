import { redirect } from 'next/navigation';

import { ROUTES } from '@/utils';
import { checkProtectedRoute } from '@/utils/checkProtectedRoute';

export default async function Culture({ searchParams }: ServerPageProps) {
  await checkProtectedRoute(searchParams);
  redirect(ROUTES.explore);
}
