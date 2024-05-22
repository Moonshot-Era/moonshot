'use client';

import { FC } from 'react';
import { Flex, Text } from '@radix-ui/themes';

import './style.scss';
import { Input, TokenCard } from '@/legos';

interface Props {
  tokensList: void;
  handleTokenSelect: () => void;
  selectMode: 'to' | 'from';
}

export const TokensSelect: FC<Props> = ({ tokensList, handleTokenSelect, selectMode }) => (
  <Flex width="100%" direction="column" align="center" gap="4" px="4" pb="6">
    <Text size="4" weight="bold">
      Convert {selectMode === 'to' ? 'to' : 'from'}
    </Text>
    <Input placeholder="Search assets" icon="search" />
    <Flex width="100%" direction="column" gap="4">
      {
        tokensList.map((token, index) => (
          <TokenCard
            type="convert"
            key={index}
            logoSrc={token.logoURI}
            name={token.name}
            currencyType="baseStatus"
            percent={token.v24hChangePercent || null}
            total={token.valueUsd || null}
            description={token.uiAmount ? token.uiAmount + ' ' + token.symbol : ''}
            onClick={() => handleTokenSelect(token)}
          />
        ))}
    </Flex>
  </Flex>
);
