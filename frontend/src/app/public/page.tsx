import { redirect } from 'next/navigation';

import { ROUTES } from '@/utils';

export default async function Public() {
  redirect(ROUTES.login);
}
