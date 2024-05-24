import { createServerClient } from '@/supabase/server';
import { COOKIE_PROVIDER_TOKEN, ROUTES } from '@/utils';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error || !code) {
    return NextResponse.redirect(`${process.env.SITE_URL}${ROUTES.login}`);
  }

  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_AUTH_CLIENT_ID!,
        client_secret: process.env.GOOGLE_AUTH_SECRET!,
        redirect_uri: process.env.GOOGLE_AUTH_REDIRECT_URL!,
        grant_type: 'authorization_code',
      }),
    });

    const data = await response.json();

    const supabaseServerClient = createServerClient();
    await supabaseServerClient.auth.signInWithIdToken({
      provider: 'google',
      token: data.id_token,
    });

    cookies().set(COOKIE_PROVIDER_TOKEN, data.id_token);

    return NextResponse.redirect(`${process.env.SITE_URL}`);
  } catch (error) {
    return NextResponse.redirect(`${process.env.SITE_URL}${ROUTES.login}`);
  }
}
