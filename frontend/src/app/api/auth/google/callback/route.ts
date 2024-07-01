import { storeCubeSignerSessionData } from '@/services';
import { createServerClient } from '@/supabase/server';
import { ROUTES } from '@/utils';
import { jwtDecode } from 'jwt-decode';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const cultureRef = searchParams.get('state');

  if (error || !code) {
    return NextResponse.redirect(`${process.env.SITE_URL}${ROUTES.login}`);
  }

  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_AUTH_CLIENT_ID!,
        client_secret: process.env.GOOGLE_AUTH_SECRET!,
        redirect_uri: process.env.GOOGLE_AUTH_REDIRECT_URL!,
        grant_type: 'authorization_code'
      })
    });

    const googleAuthResponse = await response.json();

    const supabaseServerClient = createServerClient();
    const {
      data: { user },
      error: signInWithIdTokenError
    } = await supabaseServerClient.auth.signInWithIdToken({
      provider: 'google',
      token: googleAuthResponse.id_token
    });

    const decodedToken = jwtDecode<{ name: string }>(
      googleAuthResponse.id_token
    );

    if (signInWithIdTokenError) {
      throw signInWithIdTokenError;
    }

    if (user) {
      if (cultureRef) {
        const { error: rpcInsertCultureRefError } =
          await supabaseServerClient.rpc('insert_culture_ref', {
            culture_ref: cultureRef
          });
        if (rpcInsertCultureRefError) {
          throw rpcInsertCultureRefError;
        }
      }

      await supabaseServerClient
        .from('profiles')
        .update({
          user_name: decodedToken.name
        })
        .eq('user_id', user.id);

      await storeCubeSignerSessionData(
        googleAuthResponse.id_token,
        user.email!
      );
    } else {
      throw Error('User is not logged in');
    }

    return NextResponse.redirect(`${process.env.SITE_URL}`);
  } catch (error) {
    return NextResponse.redirect(`${process.env.SITE_URL}${ROUTES.login}`);
  }
}
