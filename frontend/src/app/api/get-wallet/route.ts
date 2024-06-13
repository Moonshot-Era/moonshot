import { NextRequest, NextResponse } from 'next/server';
import { getUserWallet } from '@/services';
import { getMfaSecret } from '@/services/helpers/getMfaSecret';
import { HEADER_PROVIDER, HEADER_PROVIDER_TOKEN, ROUTES } from '@/utils';
import { ErrResponse } from '@cubist-labs/cubesigner-sdk';
import { getResponseToRefreshToken } from '@/utils/getResponse';

export async function POST(request: NextRequest) {
  console.log('debug > request.headers ==== ', request.headers);
  const token = request.headers.get(HEADER_PROVIDER_TOKEN);
  const provider = request.headers.get(HEADER_PROVIDER);
  console.log('debug > token ==== ', token);
  console.log('debug > provider ==== ', provider);
  console.log('debug > request.headers ==== ', request.headers);

  try {
    if (!token || !provider) {
      throw Error('There is no token or provider in the headers');
    }

    const totpSecret = await getMfaSecret();

    const wallet = await getUserWallet(token, totpSecret || '');

    return NextResponse.json({ wallet });
  } catch (err: any) {
    console.log('debug > get wallet err ==== ', err);
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
