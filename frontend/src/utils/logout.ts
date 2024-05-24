import { createBrowserClient } from '@/supabase/client';

export const logout = async () => {
  const supabaseClient = createBrowserClient();
  supabaseClient.auth.signOut();
};
