'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Flex, Text } from '@radix-ui/themes';

import { useWidth } from '@/hooks/useWidth';
import { Skeleton } from '../Skeleton/Skeleton';
import { Toolbar } from '../Toolbar/Toolbar';
import { BadgeSecond, AssetCard } from '@/legos';
import { usePortfolio } from '@/hooks/usePortfolio';
import { formatNumberToUsd, isSolanaAddress } from '@/helpers/helpers';
import { WalletPortfolioAssetType } from '@/services/helius/getWalletPortfolio';

import './style.scss';

interface HomeContentProps {
  walletAddress: string;
  userId?: string;
}

export const HomeContent = ({ walletAddress, userId }: HomeContentProps) => {
  const { mdScreen } = useWidth();
  const { portfolio, isLoading } = usePortfolio(walletAddress);
  const router = useRouter();

  const totalH24 = portfolio?.walletAssets?.reduce((acc, cur) => {
    return acc + cur?.valueUsd / (1 + cur?.percentage_change_h24 / 100);
  }, 0);

  const totalBalance =
    portfolio?.walletAssets?.reduce((acc, cur) => {
      return acc + cur?.valueUsd;
    }, 0) || 0;

  useEffect(() => {
    window.addEventListener('load', function () {
      // @ts-ignore
      progressier.add({
        id: userId
      });
    });
    return () => {
      window.removeEventListener('load', function () {
        // @ts-ignore
        progressier.add({
          id: userId
        });
      });
    };
  }, []);

  const positiveBalance = totalBalance > 0;

  return isLoading ? (
    <Skeleton variant="home" />
  ) : (
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
                {formatNumberToUsd().format(totalBalance).split('.')[0]}
              </Text>
              <Text size={mdScreen ? '6' : '5'} weight="medium" mt="2" ml="2px">
                {((totalBalance % 1) * 100).toFixed(0)}
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
              percent={totalBalance / totalH24}
              total={totalBalance - totalH24}
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
          <Text size={mdScreen ? '5' : '3'} weight="medium" mb="2">
            My portfolio
          </Text>
          {portfolio?.walletAssets?.length ? (
            portfolio.walletAssets.map((asset: WalletPortfolioAssetType) => (
              <AssetCard
                key={asset.address}
                asset={asset}
                onClick={() =>
                  router.push(
                    `/culture/${
                      isSolanaAddress(asset.address)
                        ? isSolanaAddress(asset.address)
                        : asset.address
                    }`
                  )
                }
              />
            ))
          ) : (
            <Box
              width="100%"
              className={`border-1 bg-magenta empty-card`}
              p="4"
            >
              <Text size={mdScreen ? '4' : '2'}>
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
