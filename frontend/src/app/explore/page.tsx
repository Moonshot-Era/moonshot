import { redirect } from 'next/navigation';
import { createServerClient } from '@/supabase/server';

import { ExploreContent } from '@/components/ExploreContent/ExploreContent';
import { ROUTES } from '@/utils';

export default async function Explore() {
  const supabaseClient = createServerClient();

  const user = (await supabaseClient.auth.getSession()).data.session?.user;

  if (!user) {
    redirect(ROUTES.login);
  }

  return <ExploreContent />;
}
