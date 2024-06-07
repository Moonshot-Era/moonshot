import { createServerClient } from '@/supabase/server';

export const getMfaSecret = async () => {
  const supabaseServerClient = createServerClient();

  const { data, error } = await supabaseServerClient.rpc('get_mfa_secret');

  if (error) {
    throw error;
  }
  return data;
};
