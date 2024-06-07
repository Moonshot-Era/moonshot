'use client';

import { Box, Flex, Text } from '@radix-ui/themes';
import Image from 'next/image';
import { FC } from 'react';

import userIcon from '../../assets/images/user-icon.png';
import './style.scss';

import { useTransactionHistory } from '@/hooks/useTransactionHistory';
import { Icon } from '@/legos';

const mockRecentActivityData = [
  {
    id: 1,
    date: 'May 11, 2024',
    transactions: [
      {
        id: 1,
        transactionType: 'Deposit',
        total: 34,
        currencyType: 'SOL',
        time: '3:31 PM',
        icon: userIcon,
        wallet: '3xKg...2jXh'
      },
      {
        id: 2,
        transactionType: 'Withdraw',
        total: 12,
        currencyType: 'SOL',
        time: '8:31 AM',
        icon: userIcon,
        wallet: '3xKg...2jXh'
      }
    ]
  },
  {
    id: 2,
    date: 'May 3, 2024',
    transactions: [
      {
        id: 1,
        transactionType: 'Convert',
        total: 1248,
        currencyType: 'SOL',
        time: '3:31 PM',
        icon: userIcon,
        wallet: '3xKg...2jXh'
      }
    ]
  }
];

interface Props {
  handleActiveTab: (
    tab: 'account' | 'recent' | 'export' | 'logout' | null
  ) => void;
  walletAddress: string;
}

export const RecentTab: FC<Props> = ({ walletAddress, handleActiveTab }) => {
  const { transactionHistory } = useTransactionHistory(
    walletAddress || 'HTnKf3f3vtLaGVVtYkZ8oCTyWEA64n5a1P4Dkkk5vjmH'
  );
  console.log('transactionHistory', transactionHistory);

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
      <Flex width="100%" direction="column" align="start" gap="24px">
        {mockRecentActivityData.map(({ id, date, transactions }) => (
          <Flex key={id} width="100%" direction="column" gap="2">
            <Text size="3" weight="medium">
              {date}
            </Text>
            {transactions.map(
              ({
                id,
                currencyType,
                time,
                total,
                transactionType,
                icon,
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
                    <Image alt="user-icon" src={icon} />
                    <Flex direction="column" justify="between">
                      <Text size="2" weight="medium">
                        {transactionType}
                      </Text>
                      <Text className="font-size-xs">
                        {transactionType === 'Deposit'
                          ? `FROM ${wallet}`
                          : transactionType === 'Withdraw'
                          ? `TO ${wallet}`
                          : `${time}`}
                      </Text>
                    </Flex>
                  </Flex>
                  <Flex direction="column" align="end" justify="between">
                    <Text size="2" weight="medium">
                      {transactionType === 'Deposit'
                        ? `+${total} ${currencyType}`
                        : transactionType === 'Withdraw'
                        ? `-${total} ${currencyType}`
                        : `+${total} ${currencyType}`}
                    </Text>
                    <Text className="font-size-xs">
                      {transactionType === 'Convert' ? `-32,980 WIF` : time}
                    </Text>
                  </Flex>
                </Flex>
              )
            )}
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
};
