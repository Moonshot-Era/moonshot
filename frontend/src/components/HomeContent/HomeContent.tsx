'use client';

import { Box, Flex, Text } from '@radix-ui/themes';

import { formatNumberToUsd } from '@/helpers/helpers';
import { BadgeSecond, TokenCard } from '@/legos';
import { Toolbar } from '../Toolbar/Toolbar';
import './style.scss';
import {
  WalletPortfolioDetailsType,
  WalletPortfolioNormilizedType,
} from '@/services/birdeye/getWalletPortfolio';

interface HomeContentProps {
  portfolio: WalletPortfolioNormilizedType;
}

export const HomeContent = ({ portfolio }: HomeContentProps) => {
  const { walletDetails, totalUsd } = portfolio;
  const totalH24 = walletDetails?.reduce((acc, cur) => {
    return acc + cur?.valueUsd / (1 + cur?.percentage_change_h24 / 100);
  }, 0);
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
            {totalUsd > 0
              ? formatNumberToUsd.format(totalUsd).split('.')[0]
              : '-'}
          </Text>
          <Text size="5" weight="medium" mt="2" ml="2px">
            {((totalUsd % 1) * 100).toFixed(0)}
          </Text>
        </Flex>
        <Box mb="8">
          {totalUsd > 0 ? (
            <BadgeSecond
              percent={totalUsd / totalH24}
              total={totalUsd - totalH24}
            />
          ) : (
            '-'
          )}
        </Box>

        <Toolbar />

        <Flex
          width="100%"
          direction="column"
          gap="4"
          mb={totalUsd > 0 ? '100px' : '1'}
        >
          <Text size="3" weight="medium" mb="2">
            My portfolio
          </Text>
          {walletDetails?.length ? (
            walletDetails.map((asset: WalletPortfolioDetailsType) => (
              <TokenCard key={asset.address} token={asset} />
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
