'use client';

import { FC } from 'react';
import { Box, Flex, Text } from '@radix-ui/themes';

import './style.scss';
import { Icon, Input, TokenCard } from '@/legos';

interface Props {
  toggleTransfer: () => void;
}

export const DepositList: FC<Props> = ({ toggleTransfer }) => (
  <Flex width="100%" direction="column" align="center" gap="4" px="4" pb="6">
    <Text size="4" weight="bold">
      Deposit
    </Text>
    <Flex
      width="100%"
      direction="row"
      py="4"
      px="3"
      gap="4"
      className="deposit-transfer-card-bank"
    >
      <Icon icon="shift4" />
      <Flex direction="column" justify="between" onClick={toggleTransfer}>
        <Text size="3" weight="medium">
          Shift4
        </Text>
        <Text>Card or bank transfer</Text>
      </Flex>
    </Flex>
    <Box width="100%" className="deposit-transfer-card-bank-border" />
    <Input placeholder="Search assets" icon="search" />
    <Flex width="100%" direction="column" gap="4">
      {Array(3)
        .fill(3)
        .map((item, index) => (
          <TokenCard
            key={index}
            name="jeo boden"
            currencyType="baseStatus"
            percent={2.7}
            total={21938}
            description="43,453 BODEN"
            handler={toggleTransfer}
          />
        ))}
    </Flex>
  </Flex>
);
