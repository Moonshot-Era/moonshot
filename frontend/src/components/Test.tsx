'use client';

import { Button, Icon } from '@/legos';
import { Flex, Text } from '@radix-ui/themes';
import axios from 'axios';

import React from 'react';

export function Test({ oidc }) {
  const handleGetBalance = async () => {
    const { data: walletData } = await axios.post(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/cube/get-wallet`,
      {
        oidc,
      },
    );

    const { data: balanceData } = await axios.post(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/solana/get-balance`,
      {
        wallet: walletData.wallet,
      },
    );

    console.log('debug > data===', balanceData);
  };

  return (
    <Button onClick={() => handleGetBalance()}>
      <Icon icon="google" width={24} />
      <Text size="2" weight="medium">
        GET BUUTON
      </Text>
    </Button>
  );
}
