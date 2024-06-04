import { NextResponse } from 'next/server';
import { approveMfaTotp, checkIfMfaReguired } from '@/services';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const oidc = cookies()?.get('pt')?.value;
  const response = await request.json();

  if (!oidc || !response?.totpCode || !response?.mfaId) {
    return NextResponse.next({
      request: {
        headers: request.headers
      }
    });
  }

  const res = await approveMfaTotp(
    oidc,
    response.totpCode
    // response.mfaId
  ).catch((err) => {
    console.log('Err', err);
  });

  console.log('debug > res===', res);

  return NextResponse.json({});
}
