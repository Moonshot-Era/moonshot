'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { COOKIE_PROVIDER_TOKEN, ROUTES } from '@/utils';
import { createServerClient } from '@/supabase/server';
import { logout } from '@/utils';

const deleteCookies = async () => {
  document.cookie = `${COOKIE_PROVIDER_TOKEN}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    deleteCookies();
    logout().then(() => {
      router.push(ROUTES.login);
    });
  }, []);

  return null;
}
