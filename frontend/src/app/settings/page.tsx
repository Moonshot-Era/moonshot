import { redirect } from 'next/navigation';
import { createServerClient } from '@/supabase/server';

import { SettingsContent } from '@/components/SettingsContent/SettingsContent';
import { ROUTES } from '@/utils';

export default async function Settings() {
  const supabaseClient = createServerClient();

  const user = (await supabaseClient.auth.getSession()).data.session?.user;

  if (!user) {
    redirect(ROUTES.login);
  }

  return <SettingsContent />;
}
