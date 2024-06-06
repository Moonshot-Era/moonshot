'use client';

import { Box, Flex, Text } from '@radix-ui/themes';
import Image from 'next/image';
import { FC, useCallback, useEffect, useState } from 'react';

import './style.scss';

import { Icon } from '@/legos';
import { createBrowserClient } from '@/supabase/client';
import { Tables } from '@/supabase/schema';

interface GroupedTransactionsType {
  date: string;
  transactions: Tables<'transactions'>[];
}

interface Props {
  handleActiveTab: (
    tab: 'account' | 'recent' | 'export' | 'logout' | null
  ) => void;
}

export const RecentTab: FC<Props> = ({ handleActiveTab }) => {
  const [transactions, setTransactions] = useState<GroupedTransactionsType[]>(
    [] as GroupedTransactionsType[]
  );
  const supabaseClient = createBrowserClient();
  const getTransactions = useCallback(async () => {
    const { data } = await supabaseClient.auth.getSession();
    const userId = data.session?.user?.id;

    const { data: transactionsList } = await supabaseClient
      .from('transactions')
      .select('*')
      .eq('user_id', userId || '');

    const groups =
      transactionsList?.reduce((groups, item) => {
        const date = item.created_at.split('T')[0];
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(item);
        return groups;
      }, {} as { [key: string]: Tables<'transactions'>[] }) ||
      ({} as { [key: string]: Tables<'transactions'>[] });

    const groupArrays = Object.keys(groups).map((date) => {
      return {
        date,
        transactions: groups[date]
      };
    });

    setTransactions(groupArrays);
  }, []);

  useEffect(() => {
    getTransactions();
  }, []);

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
        {transactions.map(({ date, transactions: item }) => (
          <Flex key={date} width="100%" direction="column" gap="2">
            <Text size="3" weight="medium">
              {date}
            </Text>
            {item?.map(
              ({
                id,
                token_amount,
                created_at,
                token_name,
                transaction_type,
                image_url,
                wallet_address
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
                      src={image_url || ''}
                    />
                    <Flex direction="column" justify="between">
                      <Text size="2" weight="medium">
                        {transaction_type === 'buy' ? 'Deposit' : 'Withdraw'}
                      </Text>
                      <Text className="font-size-xs">
                        {transaction_type === 'buy'
                          ? `FROM ${wallet_address}`
                          : transaction_type === 'sell'
                          ? `TO ${wallet_address}`
                          : `${new Date(created_at).toLocaleTimeString(
                              'en-US',
                              {
                                timeZone: 'UTC',
                                hour12: true,
                                hour: 'numeric',
                                minute: 'numeric'
                              }
                            )}`}
                      </Text>
                    </Flex>
                  </Flex>
                  <Flex direction="column" align="end" justify="between">
                    <Text size="2" weight="medium">
                      {transaction_type === 'buy'
                        ? `+${token_amount} ${token_name}`
                        : transaction_type === 'sell'
                        ? `-${token_amount} ${token_name}`
                        : `+${token_amount} ${token_name}`}
                    </Text>
                    <Text className="font-size-xs">
                      {transaction_type === 'convert'
                        ? `-32,980 WIF`
                        : new Date(created_at).toLocaleTimeString('en-US', {
                            timeZone: 'UTC',
                            hour12: true,
                            hour: 'numeric',
                            minute: 'numeric'
                          })}
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
