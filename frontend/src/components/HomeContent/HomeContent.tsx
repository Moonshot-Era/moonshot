'use client';

import { Box, Flex, Text } from '@radix-ui/themes';

import { formatNumberToUsd } from '@/helpers/helpers';
import { BadgeSecond, AssetCard } from '@/legos';
import { Toolbar } from '../Toolbar/Toolbar';
import './style.scss';
import {
  WalletPortfolioAssetType,
  WalletPortfolioNormilizedType,
} from '@/services/birdeye/getWalletPortfolio';
import axios from 'axios';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

interface HomeContentProps {
  walletAddress: string;
}

const fetchPortfolio = (
  walletAddress: string
): Promise<WalletPortfolioNormilizedType> =>
  axios
    .post(`${process.env.NEXT_PUBLIC_SITE_URL}/api/birdeye/wallet-portfolio`, {
      walletAddress,
    })
    .then((response) => response.data.walletPortfolio);

const usePortfolio = (walletAddress: string) => {
  const { data, ...rest } = useQuery({
    queryKey: ['portfolio'],
    queryFn: () => fetchPortfolio(walletAddress),
  });

  return { portfolio: data, ...rest };
};

export const HomeContent = ({ walletAddress }: HomeContentProps) => {
  const { portfolio, isFetching } = usePortfolio(walletAddress);
  const [balance, setBalance] = useState(portfolio?.totalUsd);

  const totalH24 = portfolio?.walletAssets?.reduce((acc, cur) => {
    return acc + cur?.valueUsd / (1 + cur?.percentage_change_h24 / 100);
  }, 0);

  const positiveBalance = portfolio?.totalUsd && portfolio.totalUsd > 0;

  return isFetching ? null : (
    <>
      <Flex
        direction="column"
        align="center"
        justify="center"
        width="100%"
        className="main-wrapper home-wrapper"
      >
        <Flex direction="row">
          {positiveBalance ? (
            <>
              <Text size="8" weight="bold">
                {formatNumberToUsd().format(portfolio.totalUsd).split('.')[0]}
              </Text>
              <Text size="5" weight="medium" mt="2" ml="2px">
                {((portfolio?.totalUsd % 1) * 100).toFixed(0)}
              </Text>
            </>
          ) : (
            <Text size="8" weight="bold">
              -
            </Text>
          )}
        </Flex>
        <Box mb="8">
          {positiveBalance && totalH24 ? (
            <BadgeSecond
              percent={portfolio.totalUsd / totalH24}
              total={portfolio.totalUsd - totalH24}
            />
          ) : (
            '-'
          )}
        </Box>

        {!!portfolio && <Toolbar portfolio={portfolio} />}

        <Flex
          width="100%"
          direction="column"
          gap="4"
          mb={positiveBalance ? '100px' : '1'}
        >
          <Text size="3" weight="medium" mb="2">
            My portfolio
          </Text>
          {portfolio?.walletAssets?.length ? (
            portfolio.walletAssets.map((asset: WalletPortfolioAssetType) => (
              <AssetCard key={asset.address} asset={asset} />
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
