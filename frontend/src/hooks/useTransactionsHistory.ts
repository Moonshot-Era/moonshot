import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import { Transaction } from '@/@types/helius';
import { StaticImageData } from 'next/image';
import { SOLANA_IMAGE_URL } from '@/utils';

export interface TransactionHistoryType {
  public: Transaction[];
  internal: TransactionDBType[];
}

export interface TransactionDBType {
  created_at: string;
  id: number;
  token_address: string | null;
  token_amount: number | null;
  token_name: string | null;
  token_price: number | null;
  transaction_type: 'buy' | 'sell' | 'withdraw' | 'convert' | null;
  user_id: string | null;
  to_wallet_address: string | null;
  token_image_url: string | null;
  token_output_address: string | null;
  token_output_amount: number | null;
  token_output_image_url: string | null;
  token_output_name: string | null;
  token_output_price: number | null;
  token_output_symbol: string | null;
  token_symbol: string | null;
  tx_hash: string | null;
}
export interface NormilizedTransactionType {
  id?: string | number;
  transactionType?: string | null;
  transactionDate?: Date | null;
  transactionSignature?: string | null;

  fromWallet?: string | null;
  tokenAmount?: number | null;
  tokenName?: string | null;
  tokenSymbol?: string | null;
  tokenImageUrl?: string | null;

  toWallet?: string | null;
  tokenConvertToAmount?: number | null;
  tokenConvertToName?: string | null;
  tokenConvertToSymbol?: string | null;
  tokenConvertToImageUrl?: string | null;
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
          tokenName: 'Solana',
          tokenSymbol: 'SOL',
          transactionDate: new Date(transaction.timestamp * 1000),
          tokenImageUrl: SOLANA_IMAGE_URL,
          transactionSignature: transaction.signature
        };
      });

    if (processedData?.length) {
      normilizedTransactionHistory = [...processedData];
    }
  }

  if (data?.internal?.length) {
    const processedInternalData: NormilizedTransactionType[] =
      data.internal?.flatMap((transaction) => {
        return {
          id: transaction.id,
          transactionType: `${transaction.transaction_type}`,
          transactionDate: new Date(transaction?.created_at),
          transactionSignature: transaction.tx_hash,

          fromWallet: walletAddress,
          tokenAmount: transaction.token_amount || 0,
          tokenName: transaction.token_name,
          tokenSymbol: transaction.token_symbol,
          tokenImageUrl: transaction?.token_image_url,

          toWallet: transaction?.to_wallet_address,
          tokenConvertToAmount: transaction.token_output_amount || 0,
          tokenConvertToName: transaction.token_output_name,
          tokenConvertToSymbol: transaction.token_output_symbol,
          tokenConvertToImageUrl: transaction.token_output_image_url
        };
      });

    if (processedInternalData?.length) {
      normilizedTransactionHistory = [
        ...normilizedTransactionHistory,
        ...processedInternalData
      ];
    }
  }

  return { transactionsHistory: normilizedTransactionHistory, ...rest };
};
