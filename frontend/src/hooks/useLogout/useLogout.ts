import { createBrowserClient } from '@/supabase/client';
import { COOKIE_PROVIDER, COOKIE_PROVIDER_TOKEN, ROUTES } from '@/utils';
import { useCookies } from 'next-client-cookies';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export const useLogout = () => {
  const router = useRouter();
  const cookies = useCookies();

  const logout = useCallback(async (): Promise<void> => {
    const supabaseClient = createBrowserClient();

    await supabaseClient.auth.signOut();

    cookies.remove(COOKIE_PROVIDER);
    cookies.remove(COOKIE_PROVIDER_TOKEN);
    router.push(`${process.env.NEXT_PUBLIC_SITE_URL}${ROUTES.login}`);
  }, [cookies, router]);

  return logout;
};
