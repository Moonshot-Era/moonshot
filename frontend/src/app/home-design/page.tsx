import { redirect } from 'next/navigation';
import { createServerClient } from '@/supabase/server';

import { HomeDesign } from '@/components/HomeDesign/HomeDesign';

export default async function Index() {
  const supabaseClient = createServerClient();

  const user = (await supabaseClient.auth.getSession()).data.session?.user;

  // if (!user) {
  //   redirect('/login');
  // }

  return <HomeDesign />;
}
