import { NextRequest, NextResponse } from 'next/server';
import { getUserWallet } from '@/services';
import { getMfaSecret } from '@/services/helpers/getMfaSecret';
import { HEADER_PROVIDER, HEADER_PROVIDER_TOKEN, ROUTES } from '@/utils';
import { ErrResponse } from '@cubist-labs/cubesigner-sdk';
import { getResponseToRefreshToken } from '@/utils/getResponse';

export async function POST(request: NextRequest) {
  const token = request.headers.get(HEADER_PROVIDER_TOKEN);
  const provider = request.headers.get(HEADER_PROVIDER);

  try {
    if (!token || !provider) {
      return NextResponse.json({ wallet: null });
    }

    const totpSecret = await getMfaSecret();

    const wallet = await getUserWallet(token, totpSecret || '');

    return NextResponse.json({ wallet });
  } catch (err: any) {
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
