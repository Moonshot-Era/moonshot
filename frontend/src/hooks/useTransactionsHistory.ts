import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import { Transaction } from '@/@types/helius';
import { StaticImageData } from 'next/image';
import { SOLANA_IMAGE_URL } from '@/utils';

export interface TransactionHistoryType {
  public: Transaction[];
  internal: {
    created_at: string;
    id: number;
    token_address: string | null;
    token_amount: number | null;
    token_name: string | null;
    token_price: number | null;
    transaction_type: 'buy' | 'sell' | null;
    user_id: string | null;
  }[];
}

export interface NormilizedTransactionType {
  id?: string;
  transactionType?: string | null;
  wallet?: string;
  fromWallet?: string;
  toWallet?: string;
  mint?: string;
  tokenAmount?: number;
  tokenName?: string;
  transactionDate?: number;
  imageUrl?: string | StaticImageData;
  tokenAmountConvertFrom?: number;
  tokenAmountConvertTo?: number;
  tokenConvertFromSymbol?: string;
  tokenConvertToSymbol?: string;
  tokenConvertFromImage?: string;
  tokenConvertToImage?: string;
  transactionSignature?: string;
}

export const fetchTransactionsHistory = (walletAddress: string) =>
  axios
    .post(`${process.env.NEXT_PUBLIC_SITE_URL}/api/transactions-history`, {
      walletAddress
    })
    .then((response) => {
      return response.data.transactions as TransactionHistoryType;
    });

export const useTransactionsHistory = (walletAddress?: string) => {
  const { data, ...rest } = useQuery({
    queryKey: ['transactions_history'],
    queryFn: () => {
      if (!walletAddress) {
        return null;
      } else {
        return fetchTransactionsHistory(walletAddress);
      }
    },
    staleTime: 30000,
    refetchOnWindowFocus: false,
    refetchOnMount: false
  });

  let normilizedTransactionHistory: NormilizedTransactionType[] = [];

  if (data?.public?.length) {
    const processedData: NormilizedTransactionType[] = data.public
      .filter(
        (transaction) =>
          transaction?.nativeTransfers?.[0]?.toUserAccount === walletAddress &&
          transaction?.nativeTransfers?.[0]?.fromUserAccount !== walletAddress
      )
      ?.flatMap((transaction) => {
        return {
          id: transaction.signature,
          transactionType: 'Deposit',
          fromWallet: transaction.nativeTransfers[0].fromUserAccount,
          toWallet: '',
          tokenAmount: transaction.nativeTransfers[0].amount / 10 ** 9 || 0,
          tokenName: 'SOL',
          transactionDate: transaction.timestamp * 1000,
          imageUrl: SOLANA_IMAGE_URL,
          transactionSignature: transaction.signature
        };
      });

    if (processedData?.length) {
      normilizedTransactionHistory = [...processedData];
    }
  }

  return { transactionsHistory: normilizedTransactionHistory, ...rest };
};
