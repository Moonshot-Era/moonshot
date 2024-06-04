import { NextResponse } from 'next/server';
import { checkIfMfaReguired } from '@/services';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const oidc = cookies()?.get('pt')?.value;

  if (!oidc) {
    return NextResponse.next({
      request: {
        headers: request.headers
      }
    });
  }

  const res = await checkIfMfaReguired(oidc).catch((err) => {
    console.log('Err', err);
  });

  return NextResponse.json({ mfaId: res?.mfaId, qrCodeUrl: res?.otpauth });
}
