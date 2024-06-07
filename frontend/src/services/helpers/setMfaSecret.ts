import { createServerClient } from '@/supabase/server';

export const setMfaSecret = async (mfa_secret: string) => {
  const supabaseServerClient = createServerClient();

  const { error } = await supabaseServerClient.rpc('store_mfa_secret', {
    mfa_secret
  });
  if (error) {
    throw error;
  }
  return;
};
