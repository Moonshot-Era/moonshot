'use client';

import { Box, Flex, Text } from '@radix-ui/themes';

import {
  formatNumber,
  formatNumberToUsd,
  isSolanaAddress,
} from '@/helpers/helpers';
import { BadgeSecond, TokenCard } from '@/legos';
import { Toolbar } from '../Toolbar/Toolbar';
import './style.scss';
import { TokenItemBirdEyeType, WalletPortfolioType } from '@/@types/birdeye';
import {
  PoolGeckoType,
  TokenAttributes,
  TokenItemGeckoType,
} from '@/@types/gecko';

interface HomeContentProps {
  portfolio: {
    walletDetails: WalletPortfolioType;
    tokensDetails: TokenItemGeckoType[];
    tokensIncludedDetails: PoolGeckoType[];
  };
}

export const HomeContent = ({ portfolio }: HomeContentProps) => {
  const { walletDetails, tokensDetails, tokensIncludedDetails } = portfolio;

  const getTokenDetails = (asset: string) => {
    const tokenDetails = tokensDetails?.find(
      (token) => token.attributes.address === (isSolanaAddress(asset) || asset)
    )?.attributes as TokenAttributes;

    const percentage_change_h24 = tokensIncludedDetails?.find(
      (included) =>
        included?.relationships?.base_token?.data?.id ===
        `solana_${isSolanaAddress(asset) || asset}`
    )?.attributes?.price_change_percentage?.h24;

    return { ...tokenDetails, percentage_change_h24 };
  };

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
            {walletDetails?.totalUsd > 0
              ? formatNumberToUsd.format(walletDetails.totalUsd).split('.')[0]
              : '-'}
          </Text>
          <Text size="5" weight="medium" mt="2" ml="2px">
            {((walletDetails?.totalUsd % 1) * 100).toFixed(0)}
          </Text>
        </Flex>
        <Box mb="8">
          {walletDetails?.totalUsd > 0 ? (
            <BadgeSecond percent={2.7} total={9578.45} />
          ) : (
            '-'
          )}
        </Box>

        <Toolbar />

        <Flex
          width="100%"
          direction="column"
          gap="4"
          mb={walletDetails?.totalUsd > 0 ? '100px' : '1'}
        >
          <Text size="3" weight="medium" mb="2">
            My portfolio
          </Text>
          {walletDetails?.items?.length ? (
            walletDetails.items.map((asset: TokenItemBirdEyeType) => (
              <TokenCard
                key={asset.address}
                token={getTokenDetails(asset.address)}
                asset={asset}
              />
            ))
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
