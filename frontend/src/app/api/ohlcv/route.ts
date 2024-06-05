import { OhlcvDataType } from '@/@types/gecko';
import { getOhlcvData } from '@/services/gecko/getOhlcv';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const requestData = await request.json();

  const poolAddress = requestData?.poolAddress;

  const { data } = await getOhlcvData(poolAddress);

  return NextResponse.json({ data } as OhlcvDataType);
}
