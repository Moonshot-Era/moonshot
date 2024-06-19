import { NextRequest, NextResponse } from 'next/server';
import { getUserWallet } from '@/services';
import { getMfaSecret } from '@/services/helpers/getMfaSecret';
import { HEADER_PROVIDER, HEADER_PROVIDER_TOKEN, ROUTES } from '@/utils';
import { ErrResponse } from '@cubist-labs/cubesigner-sdk';
import { getResponseToRefreshToken } from '@/utils/getResponse';
import { jwtDecode } from 'jwt-decode';
import { createServerClient } from '@/supabase/server';
import { logger } from '@/services/logger/pino';

export async function POST(request: NextRequest) {
  const token = request.headers.get(HEADER_PROVIDER_TOKEN);
  const provider = request.headers.get(HEADER_PROVIDER);

  try {
    if (!token || !provider) {
      throw Error('There is no token or provider in the headers');
    }

    const decodedToken = jwtDecode<{ email: string }>(token);
    let email: string | undefined = decodedToken.email;

    if (!email) {
      const supabaseClient = await createServerClient();
      const user = await supabaseClient.auth.getUser();
      email = user.data.user?.email;
    }

    if (!email) {
      throw Error('Email is missing');
    }

    const wallet = await getUserWallet(token, email);

    return NextResponse.json({ wallet });
  } catch (err: any) {
    logger.error('route get-wallet =>', err.message ?? err);
    if (
      (err as ErrResponse)?.errorCode === 'InvalidOidcToken' ||
      ((err as ErrResponse)?.statusText === 'Forbidden' &&
        (err as ErrResponse)?.status === 403 &&
        (err as ErrResponse)?.errorCode !== 'SessionRefreshTokenExpired')
    ) {
      return getResponseToRefreshToken();
    }

    return NextResponse.json({ wallet: null });
  }
}
