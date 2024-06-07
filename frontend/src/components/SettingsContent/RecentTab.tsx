'use client';

import { useTransactionHistory } from '@/hooks/useTransactionHistory';
import { Icon } from '@/legos';
import { Box, Flex, Spinner, Text } from '@radix-ui/themes';
import axios from 'axios';
import Image, { StaticImageData } from 'next/image';
import { FC } from 'react';
import solanaIcon from '../../assets/images/solana-icon.png';
import './style.scss';

interface FormattedTransactionType {
  id: string;
  transactionType: 'deposit' | 'withdraw' | 'convert';
  wallet: string;
  tokenAmount: number;
  tokenName: string;
  transactionDate: string;
  imageUrl: string;
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
    useTransactionHistory(
      walletAddress || 'HTnKf3f3vtLaGVVtYkZ8oCTyWEA64n5a1P4Dkkk5vjmH'
    );

  const getTokenData = (tokenAddress: string) => {
    return axios
      .post(`${process.env.NEXT_PUBLIC_SITE_URL}/api/get-token-info`, {
        tokenAddress
      })
      .then((response) => {
        const tokenOverview = response.data;

        return {
          tokenName: tokenOverview.name,
          logoURI: tokenOverview.logoURI
        };
      })
      .catch((error) => {
        console.error('Error fetching token info:', error);
        return { tokenName: '', logoURI: solanaIcon };
      });
  };

  const convertTimestamp = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const hour = date.getHours();
    const minutes = date.getMinutes();
    return `${hour}:${minutes}`;
  };

  const determineOperationType = (
    transfer: { fromUserAccount: string; toUserAccount: string },
    walletAddress: string
  ): FormattedTransactionType['transactionType'] => {
    if (
      transfer.fromUserAccount ===
      (walletAddress || 'HTnKf3f3vtLaGVVtYkZ8oCTyWEA64n5a1P4Dkkk5vjmH')
    ) {
      return 'withdraw';
    } else if (
      transfer.toUserAccount ===
      (walletAddress || 'HTnKf3f3vtLaGVVtYkZ8oCTyWEA64n5a1P4Dkkk5vjmH')
    ) {
      return 'deposit';
    } else {
      return 'convert';
    }
  };

  const processTransfer = (
    transfer: {
      fromUserAccount: string;
      toUserAccount: string;
      amount: number;
    },
    transaction: any,
    walletAddress: string,
    tokenName: string = 'SOL',
    logoURI: string | StaticImageData = solanaIcon,
    convertLogoURI: string | StaticImageData = solanaIcon
  ) => {
    const operationType = determineOperationType(transfer, walletAddress);
    return {
      id: transaction.signature,
      transactionType: operationType,
      wallet: walletAddress,
      tokenAmount: transfer.amount,
      tokenName: tokenName,
      transactionDate: transaction.timestamp,
      imageUrl: logoURI,
      ...(operationType === 'convert' && { convertLogoURI })
    };
  };

  const processedData: FormattedTransactionType[] =
    transactionHistory?.flatMap((transaction) => {
      const nativeTransfers = transaction.nativeTransfers.map(
        (nativeTransfer) =>
          processTransfer(nativeTransfer, transaction, walletAddress)
      );

      const tokenTransfers = transaction.tokenTransfers.map((tokenTransfer) => {
        // ????
        const { tokenName, logoURI } = getTokenData(tokenTransfer.mint || '');

        return processTransfer(
          {
            fromUserAccount: tokenTransfer.fromUserAccount,
            toUserAccount: tokenTransfer.toUserAccount,
            amount: tokenTransfer.tokenAmount
          },
          transaction,
          walletAddress,
          tokenName,
          logoURI
        );
      });

      return [...nativeTransfers, ...tokenTransfers];
    }) || [];

  const transactionGroups =
    processedData?.reduce((groups, item) => {
      const date = new Date(+item.transactionDate * 1000)
        .toISOString()
        .split('T')[0];
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(item);
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
          {transactionGroupArrays.map(({ date, transactions }) => (
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
                  wallet
                }) => (
                  <Flex
                    key={id}
                    width="100%"
                    justify="between"
                    p="3"
                    className="setting-recent-card"
                  >
                    <Flex direction="row" gap="2">
                      <Image
                        alt="user-icon"
                        width={48}
                        height={48}
                        src={imageUrl}
                      />
                      <Flex direction="column" justify="between">
                        <Text size="2" weight="medium">
                          {transactionType}
                        </Text>
                        <Text className="font-size-xs">
                          {transactionType === 'deposit'
                            ? `FROM ${wallet}`
                            : transactionType === 'withdraw'
                            ? `TO ${wallet}`
                            : convertTimestamp(+transactionDate)}
                        </Text>
                      </Flex>
                    </Flex>
                    <Flex direction="column" align="end" justify="between">
                      <Text size="2" weight="medium">
                        {transactionType === 'deposit'
                          ? `+${tokenAmount} ${tokenName}`
                          : transactionType === 'withdraw'
                          ? `-${tokenAmount} ${tokenName}`
                          : `+${tokenAmount} ${tokenName}`}
                      </Text>
                      <Text className="font-size-xs">
                        {transactionType === 'convert'
                          ? `-32,980 WIF`
                          : convertTimestamp(+transactionDate)}
                      </Text>
                    </Flex>
                  </Flex>
                )
              )}
            </Flex>
          ))}
        </Flex>
      )}
    </Flex>
  );
};
