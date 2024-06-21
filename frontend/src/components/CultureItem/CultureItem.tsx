'use client';

import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { Box, Flex, Spinner, Text } from '@radix-ui/themes';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import {
  formatCashNumber,
  formatNumberToUsFormat,
  formatNumberToUsd,
  isSolanaAddress
} from '@/helpers/helpers';
import { Icon } from '@/legos';
import { Toolbar } from '../Toolbar/Toolbar';

import { useWallet } from '@/hooks';
import { useOhlcv } from '@/hooks/useOhlcvc';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useWidth } from '@/hooks/useWidth';
import { WalletPortfolioNormilizedType } from '@/services/helius/getWalletPortfolio';
import { CultureChart } from '../CultureChart/CultureChart';
import './style.scss';
import { Skeleton } from '../Skeleton/Skeleton';
import { useTokenOverview } from '@/hooks/useTokenOverview';
import { useTokenInfo } from '@/hooks/useTokenInfo';
import { CultureError } from '../CultureError/CultureError';

export const CultureItem = ({
  tokenAddress,
  isPublic
}: {
  tokenAddress: string;
  isPublic?: boolean;
}) => {
  const { mdScreen } = useWidth();
  const router = useRouter();
  const { walletData, isFetching: isWalletFetching } = useWallet();
  const { tokenOverview, isFetching: isTokenOverviewFetching } =
    useTokenOverview({ tokenAddress });
  const { tokenInfo, isFetching: isTokenInfoFetching } = useTokenInfo({
    tokenAddress
  });

  const {
    portfolio,
    isFetching: isPortfolioFetching,
    refetch: refetchPortfolio
  } = usePortfolio(walletData?.wallet);

  const [timeFrame, setTimeFrame] = useState({ aggregate: '1', time: 'hour' });
  const [beforeTimestamp, setBeforeTimestamp] = useState<number | undefined>();
  const {
    ohlcv = [],
    isFetching: ohlcvLoading,
    isFetchingNextPage: ohlcvLoadingNextPage,
    refetch,
    fetchNextPage
  } = useOhlcv(
    tokenOverview?.poolAddress,
    timeFrame.time,
    timeFrame.aggregate,
    beforeTimestamp
  );

  useEffect(() => {
    if (beforeTimestamp) {
      fetchNextPage();
    }
  }, [beforeTimestamp]);

  useEffect(() => {
    refetch();
  }, [timeFrame]);

  useEffect(() => {
    if (!ohlcv?.length && tokenOverview?.poolAddress) {
      refetch();
    }
  }, [ohlcv?.length, refetch, tokenOverview?.poolAddress]);

  useEffect(() => {
    if (walletData && !portfolio) {
      refetchPortfolio();
    }
  }, [portfolio, refetchPortfolio, walletData]);

  const asset = portfolio?.walletAssets?.find((item) =>
    isSolanaAddress(item?.address)
      ? isSolanaAddress(item?.address) === tokenInfo?.address
      : item?.address === tokenInfo?.address
  );

  const handleChangeTimeFrame = (value: string) => {
    const [aggregateValue, timeFrameValue] = value.split('-');
    setBeforeTimestamp(undefined);
    setTimeFrame({ aggregate: aggregateValue, time: timeFrameValue });
  };

  const uniqueOhlcvValues = (arr: { time: number; value: number[] }[] | []) => {
    const map = new Map(arr.map((obj) => [obj.time, obj]));
    return [...map.values()];
  };

  const chartData: { time: number; value: number[] }[] | [] = uniqueOhlcvValues(
    ohlcv
  ).sort((a, b) => {
    return a.time - b.time;
  });

  const loadMoreBars = useCallback(() => {
    setBeforeTimestamp(chartData[0].time);
  }, [chartData]);

  const tokenName = isSolanaAddress(tokenInfo?.address)
    ? 'SOL'
    : tokenInfo?.name;

  return isTokenInfoFetching || isTokenOverviewFetching ? (
    <Skeleton variant="culture" />
  ) : tokenInfo?.name ? (
    <>
      <Flex
        direction="column"
        align="center"
        justify="start"
        width="100%"
        className="main-wrapper explore-culture-wrapper"
        pr="2"
      >
        <Flex direction="column" width="100%" gap="4">
          <Flex
            position="relative"
            width="100%"
            justify="center"
            align="center"
            direction="row"
            mb="8"
            gap="3"
          >
            {tokenInfo?.imageUrl && tokenInfo?.imageUrl?.includes('http') && (
              <Flex position="relative" width="24px" height="24px">
                <Image
                  className="border-radius-full"
                  width={24}
                  height={24}
                  alt="Token logo"
                  src={tokenInfo?.imageUrl}
                />
              </Flex>
            )}
            <Text size={mdScreen ? '5' : '4'} weight="bold">
              {tokenName}
            </Text>
            {!isPublic && (
              <Box
                position="absolute"
                left="0"
                className="explore-icon-arrow"
                onClick={() => router.back()}
              >
                <Icon icon="arrowRight" />
              </Box>
            )}
          </Flex>

          <Flex direction="column" width="100%" className="chart-wrapper">
            <ToggleGroup.Root
              className="ToggleGroup"
              type="single"
              value={`${timeFrame.aggregate}-${timeFrame.time}`}
              onValueChange={handleChangeTimeFrame}
            >
              <ToggleGroup.Item className="ToggleGroupItem" value="1-day">
                1D
              </ToggleGroup.Item>
              <ToggleGroup.Item className="ToggleGroupItem" value="12-h">
                12H
              </ToggleGroup.Item>
              <ToggleGroup.Item className="ToggleGroupItem" value="4-hour">
                4H
              </ToggleGroup.Item>
              <ToggleGroup.Item className="ToggleGroupItem" value="1-hour">
                1H
              </ToggleGroup.Item>
              <ToggleGroup.Item className="ToggleGroupItem" value="15-minute">
                15m
              </ToggleGroup.Item>
              <ToggleGroup.Item className="ToggleGroupItem" value="5-minute">
                5m
              </ToggleGroup.Item>
              <ToggleGroup.Item className="ToggleGroupItem" value="1-minute">
                1m
              </ToggleGroup.Item>
            </ToggleGroup.Root>
            <Flex height="200px" justify="center" align="center">
              {ohlcvLoading && !ohlcvLoadingNextPage ? (
                <Spinner />
              ) : (
                <CultureChart
                  key={`${timeFrame.aggregate}-${timeFrame.time}`}
                  data={chartData}
                  tokenDecimals={tokenOverview?.decimals || 0}
                  loadMoreBars={loadMoreBars}
                />
              )}
            </Flex>
          </Flex>
          {!isPublic &&
            (!isWalletFetching && !isPortfolioFetching ? (
              <Toolbar
                portfolio={portfolio || ({} as WalletPortfolioNormilizedType)}
                withShare
                tokenPrice={+tokenOverview.price_usd}
                hideWithdraw={!asset}
                tokenPrefill={{
                  ...tokenInfo,
                  ...tokenOverview
                }}
              />
            ) : (
              <Flex align="center" justify="center" width="100%">
                <Spinner size="3" />
              </Flex>
            ))}

          {asset && (
            <Flex
              direction="row"
              p="4"
              justify="between"
              className="explore-card"
            >
              <Flex width="100%" direction="column" justify="between">
                <Text size={mdScreen ? '4' : '3'} weight="medium">
                  Your balance
                </Text>
                <Text size={mdScreen ? '3' : '2'} weight="medium">
                  {formatNumberToUsd().format(asset?.valueUsd)}
                </Text>
              </Flex>
              <Flex
                width="100%"
                direction="column"
                justify="between"
                align="end"
              >
                {tokenInfo?.imageUrl &&
                  tokenInfo?.imageUrl?.includes('http') && (
                    <Flex position="relative" width="24px" height="24px">
                      <Image
                        className="border-radius-full"
                        width={24}
                        height={24}
                        alt="Token logo"
                        src={tokenInfo?.imageUrl}
                      />
                    </Flex>
                  )}
                <Text size={mdScreen ? '3' : '1'} mt="1">
                  {asset?.uiAmount} {asset?.symbol}
                </Text>
              </Flex>
            </Flex>
          )}

          {tokenInfo?.description ? (
            <Flex
              direction="column"
              p="4"
              justify="between"
              className="explore-card"
            >
              <Text
                size={mdScreen ? '4' : '3'}
                weight="medium"
                mb="2"
              >{`About ${tokenName}`}</Text>
              {tokenInfo?.description && (
                <Text size={mdScreen ? '3' : '1'}>
                  {tokenInfo?.description}
                </Text>
              )}
            </Flex>
          ) : null}
          <Flex
            direction="column"
            p="4"
            gap="2"
            justify="between"
            className="explore-card"
          >
            <Flex direction="row" justify="between" align="center">
              <Text size={mdScreen ? '4' : '3'} weight="medium" mb="2">
                Stats
              </Text>
              <Flex direction="row" gap="1">
                {tokenInfo?.telegramUrl && (
                  <Link href={tokenInfo?.telegramUrl} target="_blank">
                    <Icon icon="telegram" width={16} height={16} />
                  </Link>
                )}
                {tokenInfo?.twitterUrl && (
                  <Link href={tokenInfo?.twitterUrl} target="_blank">
                    <Icon icon="twitter" width={16} height={16} />
                  </Link>
                )}
                {tokenInfo?.websiteUrl && (
                  <Link href={`${tokenInfo?.websiteUrl}`} target="_blank">
                    <Icon icon="monitor" width={16} height={16} />
                  </Link>
                )}
              </Flex>
            </Flex>

            {!!tokenOverview?.mc && (
              <Flex direction="row" justify="between" align="center">
                <Flex direction="row" gap="1">
                  <Icon icon="chartPie" width={14} height={14} />
                  <Text size={mdScreen ? '3' : '1'} weight="medium">
                    Market cap
                  </Text>
                </Flex>
                <Text size={mdScreen ? '3' : '1'}>
                  {formatCashNumber().format(+tokenOverview?.mc)}
                </Text>
              </Flex>
            )}
            {!!tokenOverview?.v24hUSD && (
              <Flex direction="row" justify="between" align="center">
                <Flex direction="row" gap="1">
                  <Icon icon="chartBar" width={14} height={14} />
                  <Text size={mdScreen ? '3' : '1'} weight="medium">
                    24H volume
                  </Text>
                </Flex>
                <Text size={mdScreen ? '3' : '1'}>
                  {formatCashNumber().format(+tokenOverview?.v24hUSD)}
                </Text>
              </Flex>
            )}
            {!!tokenOverview?.liquidity && (
              <Flex direction="row" justify="between" align="center">
                <Flex direction="row" gap="1">
                  <Icon icon="chartLine" width={14} height={14} />
                  <Text size={mdScreen ? '3' : '1'} weight="medium">
                    Liquidity
                  </Text>
                </Flex>
                <Text size={mdScreen ? '3' : '1'}>
                  {formatCashNumber().format(+tokenOverview?.liquidity)}
                </Text>
              </Flex>
            )}
            {!!tokenOverview?.supply && (
              <Flex direction="row" justify="between" align="center">
                <Flex direction="row" gap="1">
                  <Icon icon="coins" width={14} height={14} />
                  <Text size={mdScreen ? '3' : '1'} weight="medium">
                    Total supply
                  </Text>
                </Flex>
                <Text size={mdScreen ? '3' : '1'}>
                  {formatNumberToUsFormat().format(+tokenOverview?.supply)}
                </Text>
              </Flex>
            )}
            {!!tokenOverview?.holder && (
              <Flex direction="row" justify="between" align="center">
                <Flex direction="row" gap="1">
                  <Icon icon="wallet" width={14} height={14} stroke={'2'} />
                  <Text size={mdScreen ? '3' : '1'} weight="medium">
                    Holders
                  </Text>
                </Flex>
                <Text size={mdScreen ? '3' : '1'}>
                  {formatNumberToUsFormat().format(tokenOverview?.holder)}
                </Text>
              </Flex>
            )}
          </Flex>
        </Flex>
      </Flex>
    </>
  ) : (
    <CultureError />
  );
};
