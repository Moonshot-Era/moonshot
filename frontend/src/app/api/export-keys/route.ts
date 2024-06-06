import { NextResponse } from 'next/server';
import { setUpTotp } from '@/services';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  // const response = await request.json();
  const oidc = cookies()?.get('pt')?.value;

  if (!oidc) {
    return NextResponse.next({
      request: {
        headers: request.headers
      }
    });
  }

  const totp = await setUpTotp(oidc).catch((err) => {
    console.log('Err', err);
  });

  // const keys = await exportUserInfo(oidc).catch((err) => {
  //   console.log('Err', err);
  // });

  return NextResponse.json({});
}
