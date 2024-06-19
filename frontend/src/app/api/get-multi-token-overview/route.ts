import { NextResponse } from 'next/server';

import { getMultiTokenOverview } from '@/services/gecko/getMultiTokenOverview';

export async function POST(request: Request) {
  const response = await request.json();

  const data = await getMultiTokenOverview(response?.tokenAddresses);
  return NextResponse.json(data);
}
