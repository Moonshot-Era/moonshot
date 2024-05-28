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

interface HomeContentProps {
  portfolio: WalletPortfolioNormilizedType;
  walletBalance?: string;
}

export const HomeContent = ({ portfolio, walletBalance }: HomeContentProps) => {
  const [balance, setBalance] = useState(walletBalance);
  const { walletAssets, totalUsd } = portfolio;
  const totalH24 = walletAssets?.reduce((acc, cur) => {
    return acc + cur?.valueUsd / (1 + cur?.percentage_change_h24 / 100);
  }, 0);

  const handleTransaction = async () => {
    await axios
      .post(`${process.env.NEXT_PUBLIC_SITE_URL}/api/solana/send-tx`, {
        fromAddress: 'HTnKf3f3vtLaGVVtYkZ8oCTyWEA64n5a1P4Dkkk5vjmH',
        toAddress: 'B8xaui7xwQSZmuPwjem7Ka5Qobag7khJHNCPWzDpmXrD',
        amount: 0.001,
      })
      .finally(async () => {
        const { data: newWalletBalance } = await axios.post(
          `${process.env.NEXT_PUBLIC_SITE_URL}/api/solana/get-balance`,
          {
            wallet: portfolio.wallet,
          }
        );
        setBalance(newWalletBalance?.balance);
      });
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
        <button onClick={() => handleTransaction()}>Transfer 0.001 SOL</button>
        <Flex direction="row">
          <Text size="2" weight="bold">
            SOL balance (devnet): {balance || 0}
          </Text>
        </Flex>
        <Flex direction="row">
          <Text size="8" weight="bold">
            {totalUsd > 0
              ? formatNumberToUsd().format(totalUsd).split('.')[0]
              : '-'}
          </Text>
          {totalUsd > 0 ? (
            <Text size="5" weight="medium" mt="2" ml="2px">
              {((totalUsd % 1) * 100).toFixed(0)}
            </Text>
          ) : null}
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

        <Toolbar portfolio={portfolio} />

        <Flex
          width="100%"
          direction="column"
          gap="4"
          mb={totalUsd > 0 ? '100px' : '1'}
        >
          <Text size="3" weight="medium" mb="2">
            My portfolio
          </Text>
          {walletAssets?.length ? (
            walletAssets.map((asset: WalletPortfolioAssetType) => (
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
