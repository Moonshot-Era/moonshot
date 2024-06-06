import { createServerClient } from '@/supabase/server';
import { COOKIE_PROVIDER, COOKIE_PROVIDER_TOKEN } from '@/utils';
import { cookies } from 'next/headers';
import { googleRefreshToken } from './googleRefresh';

export async function POST() {
  try {
    const supabaseServerClient = createServerClient();
    const { data: userData, error: userError } =
      await supabaseServerClient.auth.getUser();

    if (userError) {
      throw userError;
    } else if (!userData) {
      throw Error('User not found');
    }

    const { data: refreshToken, error: refreshTokenError } =
      await supabaseServerClient.rpc('get_refresh_token');

    if (refreshTokenError) {
      throw refreshTokenError;
    }

    const provider = cookies().get(COOKIE_PROVIDER);
    if (provider?.value === 'g') {
      const googleAuthResponse = await googleRefreshToken(refreshToken);
      const idToken = googleAuthResponse.id_token;

      cookies().set(COOKIE_PROVIDER, 'g');
      cookies().set(COOKIE_PROVIDER_TOKEN, idToken);

      return idToken;
    }

    return null;
  } catch (error) {
    return null;
  }
}
