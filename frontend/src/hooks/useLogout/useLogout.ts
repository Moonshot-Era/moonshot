import { createBrowserClient } from '@/supabase/client';
import { ROUTES } from '@/utils';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export const useLogout = () => {
  const router = useRouter();

  const logout = useCallback(async (): Promise<void> => {
    const supabaseClient = createBrowserClient();
    await supabaseClient.rpc('store_session_data', {
      session_data: ''
    });

    await supabaseClient.auth.signOut();

    router.push(`${process.env.NEXT_PUBLIC_SITE_URL}${ROUTES.login}`);
  }, [router]);

  return logout;
};
