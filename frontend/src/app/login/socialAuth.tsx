'use client';

import { createBrowserClient } from '@/supabase/client';
import { Auth } from '@supabase/auth-ui-react';

export const SocialAuth = () => {
  const supabase = createBrowserClient();

  return (
    <Auth
      theme="default"
      view="sign_in"
      showLinks={false}
      supabaseClient={supabase}
      providers={['google']}
      redirectTo={`${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`}
    />
  );
};
