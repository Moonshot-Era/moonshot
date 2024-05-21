'use client';

import { FC } from 'react';
import { Flex, Text } from '@radix-ui/themes';

import './style.scss';
import { Input, TokenCard } from '@/legos';

interface Props {
  toggleTransfer: () => void;
}

export const ConvertList: FC<Props> = ({ toggleTransfer }) => (
  <Flex width="100%" direction="column" align="center" gap="4" px="4" pb="6">
    <Text size="4" weight="bold">
      Convert
    </Text>
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
