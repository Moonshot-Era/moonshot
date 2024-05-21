'use client';

import { Box, Flex, Text } from '@radix-ui/themes';

import './style.scss';
import { Icon, Input, SlideButton } from '@/legos';

const mockWithdrawData = {
  currencyName: 'MICHI',
  wallet: '5CxsB1BH...3whqAKYa',
  processingTime: '< 1 minute',
  minDeposit: '10,000 MICHI',
  balance: 435,
};

export const WithdrawItem = () => (
  <Flex width="100%" direction="column" align="center" px="4" pb="6" gap="6">
    <Text size="4" weight="bold">
      {`Withdraw ${mockWithdrawData.currencyName}`}
    </Text>
    <Flex width="100%" justify="center" align="center" position="relative">
      <Text size="7" weight="medium">
        {`${mockWithdrawData.balance}$`}
      </Text>
      <Flex direction="column" align="center" position="absolute" right="0">
        <Icon icon="switchHorizontal" />
        <Text size="4" weight="medium">
          {mockWithdrawData.currencyName}
        </Text>
      </Flex>
    </Flex>

    <Box width="100%" py="2" pl="2" pr="4" className="withdraw-info-card">
      <Text size="1" weight="medium">
        You need at least 1,000 MICHI to complete a withdrawal
      </Text>
    </Box>
    <Input placeholder="Wallet address" />
    <SlideButton />
  </Flex>
);
