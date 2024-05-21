'use client';

import { Box, Flex, Text } from '@radix-ui/themes';

import { formatNumber } from '@/helpers/helpers';
import { BadgeSecond, TokenCard } from '@/legos';
import { Toolbar } from '../Toolbar/Toolbar';
import './style.scss';
import { TokenItemType, WalletPortfolioType } from '@/@types/birdeye';

const mockBalance = 123831.74;

const formatBalance = formatNumber(mockBalance);

interface HomeContentProps {
  portfolio: WalletPortfolioType;
}

export const HomeContent = ({ portfolio }: HomeContentProps) => {
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
            {portfolio?.totalUsd > 0 ? portfolio.totalUsd.toFixed(2) : '-'}
          </Text>
          {portfolio?.totalUsd > 0 ? (
            <Text size="5" weight="medium" mt="2" ml="2px">
              {portfolio?.totalUsd.toFixed(2)}
            </Text>
          ) : null}
        </Flex>
        <Box mb="8">
          {portfolio?.totalUsd > 0 ? (
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
          mb={portfolio?.totalUsd > 0 ? '100px' : '1'}
        >
          <Text size="3" weight="medium" mb="2">
            My portfolio
          </Text>
          {portfolio?.items?.length ? (
            portfolio.items.map((asset: TokenItemType) => (
              <TokenCard
                key={asset.address}
                name={asset.name}
                logo={asset.logoURI}
                currencyType={asset.symbol}
                percent={2.7}
                total={-21938}
                description="43,453 BODEN"
                isLabel
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
