"use client";

import { FC } from "react";
import { Flex, Text } from '@radix-ui/themes';
import { AssetCard, Input, TokenCard } from '@/legos';

import './style.scss';
import { PoolGeckoType } from '@/@types/gecko';
import { WalletPortfolioAssetType } from '@/services/birdeye/getWalletPortfolio';

interface Props {
  tokensList: WalletPortfolioAssetType[] | PoolGeckoType[];
  handleTokenSelect: (token: WalletPortfolioAssetType | PoolGeckoType) => void;
  selectMode: 'to' | 'from';
}

export const TokensSelect: FC<Props> = ({
  tokensList,
  handleTokenSelect,
  selectMode,
}) => (
  <Flex
    width="100%"
    direction="column"
    align="center"
    gap="4"
    pb="6"
    position="relative"
  >
    <Flex className="search-input-holder" pb="2" px="4" direction="column">
      <Text size="4" weight="bold" align="center" mb="2">
        Convert {selectMode === 'to' ? 'to' : 'from'}
      </Text>
      <Input placeholder="Search assets" icon="search" />
    </Flex>
    <Flex width="100%" direction="column" gap="4" px="4">
      {selectMode === 'from'
        ? tokensList?.map((token: WalletPortfolioAssetType) => {
            return (
              <AssetCard
                key={token?.address}
                asset={token}
                onClick={() => handleTokenSelect(token)}
              />
            );
          })
        : tokensList?.map((token: PoolGeckoType) => {
            return (
              <TokenCard
                key={token?.attributes?.address}
                token={token}
                onClick={() => handleTokenSelect(token)}
              />
            );
          })}
    </Flex>
  </Flex>
);
