import { NextResponse } from 'next/server';
import { getUserWallet } from '@/services';

export async function POST(request: Request) {
  const response = await request.json();
  const wallet = await getUserWallet(response.oidc);

  return NextResponse.json({ wallet });
}
