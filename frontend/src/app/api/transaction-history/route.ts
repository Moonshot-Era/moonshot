import { Transaction } from '@/@types/helius';
import { getTransactionHistory } from '@/services/helius/getTransactionHistory';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const data = await request.json();

  const walletAddress = data?.walletAddress;

  const transactionHistory: Transaction[] = await getTransactionHistory(
    walletAddress
  );
  return NextResponse.json({ transactionHistory });
}
