'use client';

import React, { useState } from 'react';
import axios from 'axios';

import { Button } from '@/legos';
import { Flex, Text } from '@radix-ui/themes';

export function Test({ oidc }: { oidc: string }) {
  const [balance, setBalance] = useState(null);
  const handleGetBalance = async () => {
    const { data: walletData } = await axios.post(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/cube/get-wallet`,
      {
        oidc,
      }
    );

    const { data: balanceData } = await axios.post(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/solana/get-balance`,
      {
        wallet: walletData.wallet,
      }
    );

    console.log('debug > data===', balanceData);
    setBalance(balanceData?.balance);
  };

  return (
    <Flex gap="4" direction="column" justify="center" align="center">
      <Text size="4" weight="medium">
        {balance ?? '-'}
      </Text>
      <Button onClick={() => handleGetBalance()}>
        <Text size="2" weight="medium">
          {!!balance ? 'REFRESH BALANCE' : 'GET BALANCE'}
        </Text>
      </Button>
    </Flex>
  );
}
