'use client';

import { tokenAddressWithDots } from '@/helpers/helpers';
import { useTransactionHistory } from '@/hooks/useTransactionHistory';
import { Icon } from '@/legos';
import { Box, Flex, Spinner, Text } from '@radix-ui/themes';
import Image, { StaticImageData } from 'next/image';
import { FC } from 'react';
import solanaIcon from '../../assets/images/solana-icon.png';
import './style.scss';

interface FormattedTransactionType {
  id?: string;
  transactionType?: string | null;
  wallet?: string;
  tokenAmount?: number;
  tokenName?: string;
  transactionDate?: string;
  imageUrl?: string | StaticImageData;
  tokenAmountDeposit?: number;
  tokenAmountWithdraw?: number;
  tokenDepositName?: string;
  tokenWithdrawName?: string;
  tokenDepositImage?: string;
  tokenWithdrawImage?: string;
}

interface TransactionGroupArraysType {
  date: string;
  transactions: FormattedTransactionType[];
}

interface Props {
  handleActiveTab: (
    tab: 'account' | 'recent' | 'export' | 'logout' | null
  ) => void;
  walletAddress: string;
}

export const RecentTab: FC<Props> = ({ walletAddress, handleActiveTab }) => {
  const { transactionHistory, isFetching: transactionLoading } =
    useTransactionHistory(walletAddress);

  const convertTimestamp = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const hour = date.getHours();
    const minutes = date.getMinutes();
    return `${hour}:${minutes}`;
  };

  const determineOperationType = (transfer: {
    fromUserAccount: string;
    toUserAccount: string;
  }): FormattedTransactionType['transactionType'] | null => {
    if (transfer.fromUserAccount === walletAddress) {
      return 'Withdraw';
    } else if (transfer.toUserAccount === walletAddress) {
      return 'Deposit';
    }
    return null;
  };

  const processedData =
    transactionHistory
      ?.filter(
        (transaction) =>
          !transaction.description.includes('to multiple accounts') &&
          (transaction.type === 'SWAP' ||
            transaction.nativeTransfers.length > 0 ||
            transaction.tokenTransfers.length > 0)
      )
      ?.flatMap((transaction) => {
        if (transaction.type === 'SWAP') {
          return {
            id: transaction.signature,
            transactionType: 'Convert',
            tokenAmountDeposit:
              transaction.events.swap.innerSwaps[0].tokenInputs[0]?.tokenAmount,
            tokenAmountWithdraw:
              transaction.events.swap.innerSwaps[0].tokenOutputs[0]
                ?.tokenAmount,
            tokenDepositName: '',
            tokenWithdrawName: '',
            transactionDate: `${transaction.timestamp}`,
            tokenDepositImage: '',
            tokenWithdrawImage: ''
          };
        } else if (transaction.tokenTransfers.length > 0) {
          const transactionType = determineOperationType(
            transaction.tokenTransfers[0]
          );
          return {
            id: transaction.signature,
            transactionType,
            wallet:
              transactionType === 'Deposit'
                ? transaction.tokenTransfers[0].fromUserAccount
                : transaction.tokenTransfers[0].toUserAccount,
            tokenAmount: transaction.tokenTransfers[0].tokenAmount,
            tokenName: '',
            transactionDate: `${transaction.timestamp}`,
            imageUrl: ''
          };
        } else if (transaction.nativeTransfers.length > 0) {
          const transactionType = determineOperationType(
            transaction.nativeTransfers[0]
          );
          return {
            id: transaction.signature,
            transactionType,
            wallet:
              transactionType === 'Deposit'
                ? transaction.nativeTransfers[0].fromUserAccount
                : transaction.nativeTransfers[0].toUserAccount,
            tokenAmount: transaction.nativeTransfers[0].amount,
            tokenName: 'SOL',
            transactionDate: `${transaction.timestamp}`,
            imageUrl: solanaIcon
          };
        }

        return {};
      }) || [];

  const transactionGroups =
    processedData?.reduce((groups, item) => {
      if (item) {
        const date = new Date(+(item.transactionDate || 0) * 1000)
          .toISOString()
          .split('T')[0];
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
          {transactionGroupArrays?.length
            ? transactionGroupArrays.map(({ date, transactions }) => (
                <Flex key={date} width="100%" direction="column" gap="2">
                  <Text size="3" weight="medium">
                    {date}
                  </Text>
                  {transactions.map(
                    ({
                      id,
                      tokenName,
                      transactionDate,
                      tokenAmount,
                      transactionType,
                      imageUrl,
                      wallet,
                      tokenAmountWithdraw,
                      tokenAmountDeposit,
                      tokenDepositImage,
                      tokenDepositName,
                      tokenWithdrawImage,
                      tokenWithdrawName
                    }) => (
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
                            {wallet && transactionDate && (
                              <Text className="font-size-xs">
                                {transactionType === 'Deposit'
                                  ? `FROM ${tokenAddressWithDots(wallet)}`
                                  : transactionType === 'Withdraw'
                                  ? `TO ${tokenAddressWithDots(wallet)}`
                                  : convertTimestamp(+transactionDate)}
                              </Text>
                            )}
                          </Flex>
                        </Flex>
                        <Flex direction="column" align="end" justify="between">
                          <Text size="2" weight="medium">
                            {transactionType === 'Deposit'
                              ? `+${tokenAmount} ${tokenName}`
                              : transactionType === 'Withdraw'
                              ? `-${tokenAmount} ${tokenName}`
                              : `+${tokenAmountDeposit} ${tokenDepositName}`}
                          </Text>
                          {transactionDate && (
                            <Text className="font-size-xs">
                              {transactionType === 'Convert'
                                ? `-${tokenAmountWithdraw} ${tokenWithdrawName}`
                                : convertTimestamp(+transactionDate)}
                            </Text>
                          )}
                        </Flex>
                      </Flex>
                    )
                  )}
                </Flex>
              ))
            : null}
        </Flex>
      )}
    </Flex>
  );
};
