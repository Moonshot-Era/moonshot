'use client';

import {
  formatNumberToUsKeepDecimals,
  tokenAddressWithDots
} from '@/helpers/helpers';
import { snackbar } from '@/helpers/snackbar';
import { useWallet } from '@/hooks';
import { useTransactionsHistory } from '@/hooks/useTransactionsHistory';
import { useWidth } from '@/hooks/useWidth';
import { Icon } from '@/legos';
import { Tooltip } from '@/legos/Tooltip';
import { Box, Flex, Spinner, Text } from '@radix-ui/themes';
import { format } from 'date-fns';
import { StaticImageData } from 'next/image';
import Link from 'next/link';
import { FC, useEffect } from 'react';
import solanaIcon from '../../assets/images/solana-icon.png';
import { TransactionsEmpty } from '../TransactionsEmpty/TransactionsEmpty';
import './style.scss';

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
  transactionSignature?: string;
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
  const { mdScreen } = useWidth();
  const { walletData } = useWallet();

  const {
    transactionsHistory,
    isFetching: transactionLoading,
    refetch
  } = useTransactionsHistory(walletData?.wallet);

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

  useEffect(() => {
    if (walletData?.wallet && !transactionsHistory?.length) {
      refetch();
    }
  }, [walletData?.wallet, transactionsHistory?.length]);

  const processedData: FormattedTransactionType[] =
    (transactionsHistory &&
      transactionsHistory
        ?.filter(
          (transaction) =>
            !transaction.description.includes('to multiple accounts')
        )
        ?.flatMap((transaction) => {
          if (transaction.type === 'SWAP') {
            const tokenAmountPattern =
              /swapped (\d+\.?\d*) (\$\w+|\w+) for (\d+\.?\d*) (\$\w+|\w+)/;
            const match = tokenAmountPattern.exec(transaction.description);
            let amountSwapped = 0;
            let tokenSwapped = '';
            let amountReceived = 0;
            let tokenReceived = '';

            if (match) {
              amountSwapped = parseFloat(match[1]);
              tokenSwapped = match[2];
              amountReceived = parseFloat(match[3]);
              tokenReceived = match[4];
            }
            return {
              id: transaction.signature,
              transactionType: 'Convert',
              tokenAmount: 0,
              tokenAmountConvertFrom: amountSwapped,
              tokenAmountConvertTo: amountReceived,
              tokenConvertFromSymbol: tokenSwapped,
              tokenConvertToSymbol: tokenReceived,
              transactionDate: transaction.timestamp * 1000,
              tokenConvertFromImage: '',
              tokenConvertToImage: '',
              transactionSignature: transaction.signature
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
              imageUrl: name === 'SOL' ? solanaIcon : '',
              transactionSignature: transaction.signature
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
              imageUrl: solanaIcon,
              transactionSignature: transaction.signature
            };
          }

          return {};
        })) ||
    [];

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
        <Spinner />
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
                                {transactionType === 'Deposit'
                                  ? `+${
                                      tokenName === 'SOL'
                                        ? formatNumberToUsKeepDecimals().format(
                                            amount / 10 ** 9
                                          )
                                        : formatNumberToUsKeepDecimals().format(
                                            amount
                                          )
                                    } ${tokenName}`
                                  : transactionType === 'Withdraw'
                                  ? `-${
                                      tokenName === 'SOL'
                                        ? formatNumberToUsKeepDecimals().format(
                                            amount / 10 ** 9
                                          )
                                        : formatNumberToUsKeepDecimals().format(
                                            amount
                                          )
                                    } ${tokenName}`
                                  : `+${formatNumberToUsKeepDecimals().format(
                                      tokenAmountConvertTo || 0
                                    )} ${tokenConvertToSymbol}`}
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
