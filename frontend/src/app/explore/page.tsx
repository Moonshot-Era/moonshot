import { redirect } from 'next/navigation';
import { createServerClient } from '@/supabase/server';

import { ExploreContent } from '@/components/ExploreContent/ExploreContent';

export default async function Explore() {
  const supabaseClient = createServerClient();

  const user = (await supabaseClient.auth.getSession()).data.session?.user;

  // if (!user) {
  //   redirect('/login');
  // }

  return <ExploreContent />;
}
