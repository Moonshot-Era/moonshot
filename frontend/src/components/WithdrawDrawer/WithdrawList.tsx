'use client';

import { Flex, Text } from '@radix-ui/themes';
import { FC } from 'react';

import { AssetCard, Input } from '@/legos';
import { WalletPortfolioAssetType } from '@/services/helius/getWalletPortfolio';
import './style.scss';

interface Props {
  toggleTransfer: (address: WalletPortfolioAssetType) => void;
  walletAssets: WalletPortfolioAssetType[];
}

export const WithdrawList: FC<Props> = ({ toggleTransfer, walletAssets }) => (
  <Flex width="100%" direction="column" align="center" gap="4" px="4" pb="6">
    <Text size="4" weight="bold">
      Withdraw
    </Text>

    <Input placeholder="Search assets" icon="search" />
    <Flex width="100%" direction="column" gap="4">
      {walletAssets?.map((asset) => (
        <AssetCard
          key={asset.id}
          asset={asset}
          onClick={() => toggleTransfer(asset)}
        />
      ))}
    </Flex>
  </Flex>
);
