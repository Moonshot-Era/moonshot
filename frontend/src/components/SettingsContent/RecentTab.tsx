'use client';

import { Box, Flex, Spinner, Text } from '@radix-ui/themes';
import { format } from 'date-fns';
import Image, { StaticImageData } from 'next/image';
import { FC } from 'react';

import { tokenAddressWithDots } from '@/helpers/helpers';
import { useTransactionsHistory } from '@/hooks/useTransactionsHistory';
import { Icon } from '@/legos';
import solanaIcon from '../../assets/images/solana-icon.png';

import { TransactionsEmpty } from '../TransactionsEmpty/TransactionsEmpty';
import './style.scss';
import { useWallet } from '@/hooks';

interface FormattedTransactionType {
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
}

interface TransactionGroupArraysType {
  date: string;
  transactions: FormattedTransactionType[];
}

interface Props {
  handleActiveTab: (
    tab: 'account' | 'recent' | 'export' | 'logout' | null
  ) => void;
}

export const RecentTab: FC<Props> = ({ handleActiveTab }) => {
  const { walletData } = useWallet();
  console.log('debug > walletData===', walletData);

  const { transactionsHistory, isFetching: transactionLoading } =
    useTransactionsHistory(walletData?.wallet);

  const determineOperationType = (transfer: {
    fromUserAccount: string;
    toUserAccount: string;
  }): FormattedTransactionType['transactionType'] | null => {
    if (transfer.fromUserAccount === walletData?.wallet) {
      return 'Withdraw';
    } else if (transfer.toUserAccount === walletData?.wallet) {
      return 'Deposit';
    }
    return null;
  };

  const processedData: FormattedTransactionType[] =
    transactionsHistory
      ?.filter(
        (transaction) =>
          !transaction.description.includes('to multiple accounts')
      )
      ?.flatMap((transaction) => {
        if (transaction.type === 'SWAP') {
          return {
            id: transaction.signature,
            transactionType: 'Convert',
            tokenAmount: 0,
            tokenAmountConvertFrom: Number(
              transaction.events?.swap?.innerSwaps[0]?.tokenInputs[0]
                ?.tokenAmount ||
                transaction.events?.swap?.tokenInputs[0]?.rawTokenAmount
                  .tokenAmount ||
                0
            ),
            tokenAmountConvertTo: Number(
              transaction.events?.swap?.innerSwaps[0]?.tokenOutputs[0]
                ?.tokenAmount ||
                transaction.events?.swap?.tokenOutputs[0]?.rawTokenAmount
                  .tokenAmount ||
                0
            ),
            tokenConvertFromSymbol: '',
            tokenConvertToSymbol: '',
            transactionDate: transaction.timestamp * 1000,
            tokenConvertFromImage: '',
            tokenConvertToImage: ''
          };
        } else if (transaction.tokenTransfers.length > 0) {
          const transactionType = determineOperationType(
            transaction.tokenTransfers[0]
          );
          const namePattern = /\d+(\.\d+)?\s(\w+)\sto/;
          const name = transaction.description.match(namePattern)?.[2] || '';

          return {
            id: transaction.signature,
            transactionType,
            fromWallet:
              transactionType === 'Deposit'
                ? transaction.tokenTransfers[0].fromUserAccount
                : '',
            toWallet:
              transactionType === 'Withdraw'
                ? transaction.tokenTransfers[0].toUserAccount
                : '',
            tokenAmount: transaction.tokenTransfers[0].tokenAmount || 0,
            tokenName: name,
            mint: transaction.tokenTransfers[0].mint,
            transactionDate: transaction.timestamp * 1000,
            imageUrl: ''
          };
        } else if (transaction.nativeTransfers.length > 0) {
          const transactionType = determineOperationType(
            transaction.nativeTransfers[0]
          );
          return {
            id: transaction.signature,
            transactionType,
            fromWallet:
              transactionType === 'Deposit'
                ? transaction.nativeTransfers[0].fromUserAccount
                : '',
            toWallet:
              transactionType === 'Withdraw'
                ? transaction.nativeTransfers[0].toUserAccount
                : '',
            tokenAmount: transaction.nativeTransfers[0].amount || 0,
            tokenName: 'SOL',
            transactionDate: transaction.timestamp * 1000,
            imageUrl: solanaIcon
          };
        }

        return {};
      }) || [];

  const transactionGroups =
    processedData?.reduce((groups, item) => {
      if (item && item.transactionDate && item.transactionType) {
        const date = format(new Date(item.transactionDate), 'PP');
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(item);
      }
      return groups;
    }, {} as { [key: string]: FormattedTransactionType[] }) || {};

  const transactionGroupArrays: TransactionGroupArraysType[] = Object.keys(
    transactionGroups
  ).map((date) => {
    return {
      date,
      transactions: transactionGroups[date]
    };
  });

  return (
    <Flex width="100%" direction="column" align="center">
      <Flex
        position="relative"
        width="100%"
        justify="center"
        align="center"
        direction="row"
        mb="6"
      >
        <Text size="4" weight="bold">
          Recent activity
        </Text>
        <Box
          position="absolute"
          left="0"
          className="settings-icon-arrow"
          onClick={() => handleActiveTab(null)}
        >
          <Icon icon="arrowRight" />
        </Box>
      </Flex>
      {transactionLoading ? (
        <Spinner />
      ) : (
        <Flex width="100%" direction="column" align="start" gap="24px">
          {transactionGroupArrays?.length ? (
            transactionGroupArrays.map(({ date, transactions }) =>
              transactions?.length ? (
                <Flex key={date} width="100%" direction="column" gap="2">
                  <Text size="3" weight="medium">
                    {format(date, 'PP')}
                  </Text>
                  {transactions.map(
                    ({
                      id,
                      tokenName,
                      transactionDate,
                      tokenAmount,
                      transactionType,
                      imageUrl,
                      fromWallet,
                      toWallet,
                      tokenAmountConvertFrom,
                      tokenAmountConvertTo,
                      tokenConvertFromSymbol,
                      tokenConvertToSymbol
                    }) => {
                      const amount = tokenAmount || 0;
                      return transactionType ? (
                        <Flex
                          key={id}
                          width="100%"
                          justify="between"
                          p="3"
                          className="setting-recent-card"
                        >
                          <Flex direction="row" gap="2">
                            {imageUrl && (
                              <Image
                                alt="user-icon"
                                width={48}
                                height={48}
                                src={imageUrl}
                              />
                            )}
                            <Flex direction="column" justify="between">
                              <Text size="2" weight="medium">
                                {transactionType}
                              </Text>
                              {transactionDate && (
                                <Text className="font-size-xs">
                                  {fromWallet
                                    ? `FROM ${tokenAddressWithDots(fromWallet)}`
                                    : toWallet
                                    ? `TO ${tokenAddressWithDots(toWallet)}`
                                    : format(transactionDate, 'hh:mm a')}
                                </Text>
                              )}
                            </Flex>
                          </Flex>
                          <Flex
                            direction="column"
                            align="end"
                            justify="between"
                          >
                            <Text size="2" weight="medium">
                              {transactionType === 'Deposit'
                                ? `+${
                                    tokenName === 'SOL'
                                      ? (amount / 10 ** 9).toFixed(4)
                                      : amount.toFixed(4)
                                  } ${tokenName}`
                                : transactionType === 'Withdraw'
                                ? `-${
                                    tokenName === 'SOL'
                                      ? (amount / 10 ** 9).toFixed(4)
                                      : amount.toFixed(4)
                                  } ${tokenName}`
                                : `+${tokenAmountConvertFrom?.toFixed(
                                    4
                                  )} ${tokenConvertFromSymbol}`}
                            </Text>
                            {transactionDate && (
                              <Text className="font-size-xs">
                                {transactionType === 'Convert'
                                  ? `-${tokenAmountConvertTo?.toFixed(
                                      4
                                    )} ${tokenConvertToSymbol}`
                                  : format(transactionDate, 'hh:mm a')}
                              </Text>
                            )}
                          </Flex>
                        </Flex>
                      ) : null;
                    }
                  )}
                </Flex>
              ) : null
            )
          ) : (
            <TransactionsEmpty />
          )}
        </Flex>
      )}
    </Flex>
  );
};
