import { NextResponse } from 'next/server';
import { getUserWallet } from '@/services';

export async function POST(request: Request) {
  const response = await request.json();

  if (!response.oidc) {
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
  const wallet = await getUserWallet(response.oidc).catch((err) => {
    console.log('Err', err);
  });

  return NextResponse.json({ wallet });
}
