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

    setBalance(balanceData?.balance);
  };

  const handleSendTransaction = async () => {
    const { data: txData } = await axios.post(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/solana/send-tx`,
      {
        oidcToken: oidc,
        toAddress: 'B8xaui7xwQSZmuPwjem7Ka5Qobag7khJHNCPWzDpmXrD',
      }
    );
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
      <Button onClick={() => handleSendTransaction()}>
        <Text size="2" weight="medium">
          SEND 0.1 SOL
        </Text>
      </Button>
    </Flex>
  );
}
