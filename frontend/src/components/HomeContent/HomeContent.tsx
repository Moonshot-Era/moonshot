'use client';

import { useState } from 'react';
import { Box, Flex, Text } from '@radix-ui/themes';

import './style.scss';
import { formatNumber } from '@/helpers/helpers';
import { BadgeSecond, IconButton, TokenCard } from '@/legos';
import { ConvertDrawer } from '../ConvertDrawer/ConvertDrawer';
import { DepositDrawer } from '../DepositDrawer/DepositDrawer';
import { WithdrawDrawer } from '../WithdrawDrawer/WithdrawDrawer';
import { Toolbar } from '../Toolbar/Toolbar';

const mockBalance = 123831.74;

const formatBalance = formatNumber(mockBalance);

export const HomeContent = () => {
  return (
    <>
      <Flex
        direction="column"
        align="center"
        justify="center"
        width="100%"
        className="main-wrapper home-wrapper"
      >
        <Flex direction="row">
          <Text size="8" weight="bold">
            {mockBalance > 0 ? formatBalance[0] : '-'}
          </Text>
          {mockBalance > 0 ? (
            <Text size="5" weight="medium" mt="2" ml="2px">
              {formatBalance[1]}
            </Text>
          ) : null}
        </Flex>
        <Box mb="8">
          {mockBalance > 0 ? (
            <BadgeSecond percent={2.7} total={9578.45} />
          ) : (
            '-'
          )}
        </Box>

        <Box px="43px">
          <Toolbar />
        </Box>

        <Flex
          width="100%"
          direction="column"
          gap="4"
          mb={mockBalance > 0 ? '100px' : '1'}
        >
          <Text size="3" weight="medium" mb="2">
            My portfolio
          </Text>
          {mockBalance > 0 ? (
            <>
              <TokenCard
                name="jeo boden"
                currencyType="solana"
                percent={2.7}
                total={-21938}
                description="43,453 BODEN"
                isLabel
              />
              <TokenCard
                name="jeo boden"
                currencyType="baseStatus"
                percent={2.7}
                total={21938}
                description="43,453 BODEN"
              />
              <TokenCard
                name="jeo boden"
                currencyType="baseStatus"
                percent={2.7}
                total={21938}
                description="43,453 BODEN"
              />
            </>
          ) : (
            <Box
              width="100%"
              className={`border-1 bg-magenta empty-card`}
              p="4"
            >
              <Text size="2">
                Your wallet is currently empty. Deposit funds to start using
                your wallet!
              </Text>
            </Box>
          )}
        </Flex>
      </Flex>
    </>
  );
};
