'use client';

import { Box, Flex, Text } from '@radix-ui/themes';
import { FC, useRef } from 'react';

import { AssetCard, Input } from '@/legos';
import { WalletPortfolioAssetType } from '@/services/helius/getWalletPortfolio';
import './style.scss';
import { useWidth } from '@/hooks/useWidth';
import { isSolanaAddress } from '@/helpers/helpers';
import { USDC_ADDRESS } from '@/utils';

interface Props {
  toggleTransfer: (address: WalletPortfolioAssetType) => void;
  walletAssets: WalletPortfolioAssetType[];
  listBottomPadding: number;
}

export const WithdrawList: FC<Props> = ({
  toggleTransfer,
  walletAssets,
  listBottomPadding
}) => {
  const { mdScreen } = useWidth();

  const sortByDefault = walletAssets?.reduce(
    (acc, cur) => {
      if (isSolanaAddress(cur.address) || cur.address === USDC_ADDRESS) {
        acc.defaultTokens.push(cur);
      } else {
        acc.restTokens.push(cur);
      }
      return acc;
    },
    {
      defaultTokens: [] as WalletPortfolioAssetType[],
      restTokens: [] as WalletPortfolioAssetType[]
    }
  );

  return (
    <Flex
      width="100%"
      direction="column"
      align="center"
      gap="4"
      px="4"
      style={{
        paddingBottom: listBottomPadding ? listBottomPadding : '24px'
      }}
    >
      <Text size={mdScreen ? '5' : '4'} weight="bold">
        Withdraw
      </Text>

      <Box pr="2" width="100%">
        <Input placeholder="Search assets" icon="search" />
      </Box>

      <Flex width="100%" direction="column" gap="4" pr="2" overflow="auto">
        {!!walletAssets?.length && (
          <>
            {sortByDefault?.defaultTokens?.map(
              (asset: WalletPortfolioAssetType) => (
                <AssetCard
                  key={asset.address}
                  asset={asset}
                  onClick={() => toggleTransfer(asset)}
                />
              )
            )}
            <div
              style={{
                width: '100%',
                height: '1px',
                backgroundColor: 'gray'
              }}
            />
            {sortByDefault?.restTokens?.map(
              (asset: WalletPortfolioAssetType) => (
                <AssetCard
                  key={asset.address}
                  asset={asset}
                  onClick={() => toggleTransfer(asset)}
                />
              )
            )}
          </>
        )}
      </Flex>
    </Flex>
  );
};
