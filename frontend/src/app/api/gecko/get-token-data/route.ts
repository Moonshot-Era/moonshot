import { NextResponse } from 'next/server';

import { getTokenData } from '@/services/gecko/getTokenData';

export async function POST(request: Request) {
  const response = await request.json();

  const data = await getTokenData(response?.tokenAddress);
  return NextResponse.json(data);
}
