'use client';

import { Box, Flex, Spinner, Text } from '@radix-ui/themes';
import Image from 'next/image';
import Link from 'next/link';

import {
  formatCashNumber,
  formatNumberToUsFormat,
  formatNumberToUsd,
  isSolanaAddress
} from '@/helpers/helpers';
import { Icon } from '@/legos';
import { Toolbar } from '../Toolbar/Toolbar';

import { useOhlcv } from '@/hooks/useOhlcvc';
import { usePortfolio } from '@/hooks/usePortfolio';
import { NormilizedTokenInfoOverview } from '@/services/gecko/getTokenInfo';
import { NormilizedTokenDataOverview } from '@/services/gecko/getTokenOverview';
import { useRouter } from 'next/navigation';
import { CultureChart } from '../CultureChart/CultureChart';
import './style.scss';

export const CultureItem = ({
  tokenInfo,
  tokenData,
  isPublic,
  walletAddress
}: {
  tokenData: NormilizedTokenDataOverview;
  tokenInfo: NormilizedTokenInfoOverview;
  isPublic?: boolean;
  walletAddress?: string;
}) => {
  const router = useRouter();
  const { portfolio } = usePortfolio(walletAddress);
  const { ohlcv, isFetching: ohlcvLoading } = useOhlcv(tokenData?.poolAddress);

  const chartData: { time: number; value: number }[] | [] =
    ohlcv?.attributes.ohlcv_list.map((item: Array<number[]>) => ({
      time: item[0],
      value: item[4]
    })) || [];

  const asset = portfolio?.walletAssets?.find((item) =>
    isSolanaAddress(item?.address)
      ? isSolanaAddress(item?.address) === tokenInfo?.address
      : item?.address === tokenInfo?.address
  );

  return tokenInfo ? (
    <>
      <Flex
        direction="column"
        align="center"
        justify="start"
        width="100%"
        className="main-wrapper explore-wrapper"
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
            {tokenInfo?.logoURI && (
              <Flex position="relative" width="24px" height="24px">
                <Image
                  className="border-radius-full"
                  width={24}
                  height={24}
                  alt="Token logo"
                  src={tokenInfo?.logoURI}
                />
              </Flex>
            )}
            <Text size="4" weight="bold">
              {tokenInfo.name}
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
          <Flex width="100%" height="200px" justify="center" align="center">
            {ohlcvLoading ? <Spinner /> : <CultureChart data={chartData} />}
          </Flex>
          {!isPublic && asset && portfolio && (
            <Toolbar
              portfolio={portfolio}
              withShare
              tokenPrice={tokenData.price_usd}
            />
          )}

          {asset && (
            <Flex
              direction="row"
              p="4"
              justify="between"
              className="explore-card"
            >
              <Flex width="100%" direction="column" justify="between">
                <Text size="3" weight="medium">
                  Your balance
                </Text>
                <Text size="2" weight="medium">
                  {formatNumberToUsd().format(asset?.valueUsd)}
                </Text>
              </Flex>
              <Flex
                width="100%"
                direction="column"
                justify="between"
                align="end"
              >
                {tokenInfo?.logoURI && (
                  <Flex position="relative" width="24px" height="24px">
                    <Image
                      className="border-radius-full"
                      width={24}
                      height={24}
                      alt="Token logo"
                      src={tokenInfo?.logoURI}
                    />
                  </Flex>
                )}
                <Text size="1" mt="1">
                  {asset?.uiAmount} {asset?.symbol}
                </Text>
              </Flex>
            </Flex>
          )}

          <Flex
            direction="column"
            p="4"
            justify="between"
            className="explore-card"
          >
            <Text
              size="3"
              weight="medium"
              mb="2"
            >{`About ${tokenInfo.name}`}</Text>
            {tokenInfo?.description && (
              <Text size="1">{tokenInfo?.description}</Text>
            )}
          </Flex>
          <Flex
            direction="column"
            p="4"
            gap="2"
            justify="between"
            className="explore-card"
          >
            <Flex direction="row" justify="between" align="center">
              <Text size="3" weight="medium" mb="2">
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

            {!!tokenData?.mc && (
              <Flex direction="row" justify="between" align="center">
                <Flex direction="row" gap="1">
                  <Icon icon="chartPie" width={14} height={14} />
                  <Text size="1" weight="medium">
                    Market cap
                  </Text>
                </Flex>
                <Text size="1">
                  {formatCashNumber().format(+tokenData?.mc)}
                </Text>
              </Flex>
            )}
            {!!tokenData?.v24hUSD && (
              <Flex direction="row" justify="between" align="center">
                <Flex direction="row" gap="1">
                  <Icon icon="chartBar" width={14} height={14} />
                  <Text size="1" weight="medium">
                    24H volume
                  </Text>
                </Flex>
                <Text size="1">
                  {formatCashNumber().format(+tokenData?.v24hUSD)}
                </Text>
              </Flex>
            )}
            {!!tokenData?.liquidity && (
              <Flex direction="row" justify="between" align="center">
                <Flex direction="row" gap="1">
                  <Icon icon="chartLine" width={14} height={14} />
                  <Text size="1" weight="medium">
                    Liquidity
                  </Text>
                </Flex>
                <Text size="1">
                  {formatCashNumber().format(+tokenData?.liquidity)}
                </Text>
              </Flex>
            )}
            {!!tokenData?.supply && (
              <Flex direction="row" justify="between" align="center">
                <Flex direction="row" gap="1">
                  <Icon icon="coins" width={14} height={14} />
                  <Text size="1" weight="medium">
                    Total supply
                  </Text>
                </Flex>
                <Text size="1">
                  {formatNumberToUsFormat().format(+tokenData?.supply)}
                </Text>
              </Flex>
            )}
            {!!tokenData?.holder && (
              <Flex direction="row" justify="between" align="center">
                <Flex direction="row" gap="1">
                  <Icon icon="wallet" width={14} height={14} stroke={'2'} />
                  <Text size="1" weight="medium">
                    Holders
                  </Text>
                </Flex>
                <Text size="1">
                  {formatNumberToUsFormat().format(tokenData?.holder)}
                </Text>
              </Flex>
            )}
          </Flex>
        </Flex>
      </Flex>
    </>
  ) : null;
};
