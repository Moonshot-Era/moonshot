import { createServerClient } from '@/supabase/server';
import { HEADER_PROVIDER } from '@/utils';
import { googleRefreshToken } from './googleRefresh';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const provider = request.headers.get(HEADER_PROVIDER);

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

    if (provider === 'g') {
      const idToken = await googleRefreshToken(refreshToken);

      return NextResponse.json({ idToken });
    }

    return NextResponse.json({ idToken: null });
  } catch (error) {
    return NextResponse.json({ idToken: null });
  }
}
