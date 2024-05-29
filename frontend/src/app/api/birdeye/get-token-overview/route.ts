import { NextResponse } from 'next/server';

import { getTokenOverview } from '@/services/birdeye/getTokenOverview';
import { TokenOverviewBirdEyeType } from '@/@types/birdeye';

export async function POST(request: Request) {
  const response = await request.json();

  const { data } = await getTokenOverview(response?.tokenAddress);
  return NextResponse.json({
    token: (data as TokenOverviewBirdEyeType) || {},
  });
}
