'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { FC, useEffect } from 'react';
import { Box, Flex, Text } from '@radix-ui/themes';

import {
  formatNumberToUsKeepDecimals,
  tokenAddressWithDots
} from '@/helpers/helpers';
import { snackbar } from '@/helpers/snackbar';
import { useWallet } from '@/hooks';
import {
  NormilizedTransactionType,
  useTransactionsHistory
} from '@/hooks/useTransactionsHistory';
import { useWidth } from '@/hooks/useWidth';
import { Icon } from '@/legos';
import { Tooltip } from '@/legos/Tooltip';
import { TransactionsEmpty } from '../TransactionsEmpty/TransactionsEmpty';
import { SkeletonRecentActivity } from '../Skeleton/components/SkeletonRecentActivity/SkeletonRecentActivity';

import './style.scss';

interface TransactionGroupArraysType {
  date: string;
  transactions: NormilizedTransactionType[];
}

interface Props {
  handleActiveTab: (
    tab: 'account' | 'recent' | 'export' | 'logout' | null
  ) => void;
}

export const RecentTab: FC<Props> = ({ handleActiveTab }) => {
  const { mdScreen } = useWidth();
  const { walletData } = useWallet();

  const {
    transactionsHistory,
    isFetching: transactionLoading,
    refetch
  } = useTransactionsHistory(walletData?.wallet);

  useEffect(() => {
    if (walletData?.wallet && !transactionsHistory?.length) {
      refetch();
    }
  }, [walletData?.wallet, transactionsHistory?.length]);

  const transactionGroups =
    transactionsHistory?.reduce((groups, item) => {
      if (item && item.transactionDate && item.transactionType) {
        const date = format(new Date(item.transactionDate), 'PP');
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(item);
      }
      return groups;
    }, {} as { [key: string]: NormilizedTransactionType[] }) || {};

  const transactionGroupArrays: TransactionGroupArraysType[] = Object.keys(
    transactionGroups
  ).map((date) => {
    return {
      date,
      transactions: transactionGroups[date]
    };
  });
  const handleCopyToClipboard = async (value: string) => {
    navigator.clipboard
      .writeText(value)
      .then(() => snackbar('info', `Copied!`));
  };

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
        <Text size={mdScreen ? '6' : '4'} weight="bold">
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
        <SkeletonRecentActivity />
      ) : (
        <Flex width="100%" direction="column" align="start" gap="24px">
          {transactionGroupArrays?.length ? (
            transactionGroupArrays.map(({ date, transactions }) =>
              transactions?.length ? (
                <Flex key={date} width="100%" direction="column" gap="2">
                  <Text size={mdScreen ? '4' : '3'} weight="medium">
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
                      tokenConvertToSymbol,
                      transactionSignature
                    }) => {
                      const amount = tokenAmount || 0;
                      return transactionType ? (
                        <Link
                          href={`https://solscan.io/tx/${transactionSignature}`}
                          target="_blank"
                        >
                          <Flex
                            key={id}
                            width="100%"
                            justify="between"
                            p="3"
                            className="setting-recent-card"
                          >
                            <Flex direction="row" gap="2">
                              <Flex direction="column" justify="between">
                                <Text
                                  size={mdScreen ? '3' : '2'}
                                  weight="medium"
                                >
                                  {transactionType}
                                </Text>
                                {transactionDate &&
                                  (fromWallet ? (
                                    <Tooltip helpText="Copy to clipboard">
                                      <Text
                                        className="font-size-xs"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleCopyToClipboard(
                                            fromWallet || ''
                                          );
                                        }}
                                      >
                                        FROM {tokenAddressWithDots(fromWallet)}
                                      </Text>
                                    </Tooltip>
                                  ) : toWallet ? (
                                    <Tooltip helpText="Copy to clipboard">
                                      <Text
                                        className="font-size-xs"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleCopyToClipboard(toWallet || '');
                                        }}
                                      >
                                        TO {tokenAddressWithDots(toWallet)}
                                      </Text>
                                    </Tooltip>
                                  ) : (
                                    <Text className="font-size-xs">
                                      {format(transactionDate, 'hh:mm a')}
                                    </Text>
                                  ))}
                              </Flex>
                            </Flex>
                            <Flex
                              direction="column"
                              align="end"
                              justify="between"
                            >
                              <Text size={mdScreen ? '3' : '2'} weight="medium">
                                {transactionType === 'Convert'
                                  ? `+${formatNumberToUsKeepDecimals().format(
                                      tokenAmountConvertTo || 0
                                    )} ${tokenConvertToSymbol}`
                                  : `${
                                      transactionType === 'Withdraw' ? '-' : '+'
                                    }${formatNumberToUsKeepDecimals().format(
                                      amount
                                    )} ${tokenName}`}
                              </Text>
                              {transactionDate && (
                                <Text className="font-size-xs">
                                  {transactionType === 'Convert'
                                    ? `-${formatNumberToUsKeepDecimals().format(
                                        tokenAmountConvertFrom || 0
                                      )} ${tokenConvertFromSymbol}`
                                    : format(transactionDate, 'hh:mm a')}
                                </Text>
                              )}
                            </Flex>
                          </Flex>
                        </Link>
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
