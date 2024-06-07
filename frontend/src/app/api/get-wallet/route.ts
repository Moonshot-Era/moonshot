import { NextResponse } from 'next/server';
import { getUserWallet } from '@/services';
import { getMfaSecret } from '@/services/helpers/getMfaSecret';

export async function POST(request: Request) {
  const response = await request.json();

  if (!response.oidc) {
    NextResponse.json({});
  }
  const totpSecret = await getMfaSecret();

  const wallet = await getUserWallet(response.oidc, totpSecret || '').catch(
    (err) => {
      console.log('Err', err);
    }
  );

  return NextResponse.json({ wallet });
}
