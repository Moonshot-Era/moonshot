import { OhlcvDataType } from '@/@types/gecko';
import { getOhlcvData } from '@/services/gecko/getOhlcv';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const requestData = await request.json();

  const { poolAddress, timeFrame } = requestData;

  const { data } = await getOhlcvData(poolAddress, timeFrame);

  return NextResponse.json({ data } as OhlcvDataType);
}
