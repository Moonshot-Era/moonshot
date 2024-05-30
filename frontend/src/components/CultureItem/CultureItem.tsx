'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Box, Flex, Text } from '@radix-ui/themes';

import { Icon } from '@/legos';
import { Toolbar } from '../Toolbar/Toolbar';
import { TokenOverviewBirdEyeType } from '@/@types/birdeye';
import {
  formatCashNumber,
  formatNumberToUsFormat,
  isSolanaAddress
} from '@/helpers/helpers';

import './style.scss';
import { useRouter } from 'next/navigation';
import { usePortfolio } from '@/hooks/usePortfolio';
import { CultureChart } from '../CultureChart/CultureChart';
import { useState } from 'react';

export const CultureItem = ({
  tokenItem,
  isPublic,
  walletAddress
}: {
  tokenItem: TokenOverviewBirdEyeType;
  isPublic?: boolean;
  walletAddress?: string;
}) => {
  const router = useRouter();
  const { portfolio } = usePortfolio(walletAddress);
  const [data, setData] = useState([20, 40, 30, 81, 10, 100, 80, 90]);
  const [labels, setLabels] = useState(['1', '2', '3', '4', '5', '6', '7']);

  const asset = portfolio?.walletAssets?.find((item) =>
    isSolanaAddress(item?.address)
      ? isSolanaAddress(item?.address) === tokenItem?.address
      : item?.address === tokenItem?.address
  );

  console.log('debug > asset===', asset);

  return tokenItem ? (
    <>
      <Flex
        direction="column"
        align="center"
        justify="center"
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
            <Flex position="relative" width="24px" height="24px">
              <Image
                className="border-radius-full"
                width={24}
                height={24}
                alt="Token logo"
                src={tokenItem?.logoURI}
              />
            </Flex>
            <Text size="4" weight="bold">
              {tokenItem.name}
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
          <CultureChart data={data} labels={labels} />
          {/* TODO Check user asset and add data */}
          {!isPublic && asset && portfolio && (
            <Toolbar portfolio={portfolio} withShare />
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
                {/* <Text size="2" weight="medium">
                  {`$${mockUserData.balance.numbersArray[0]}`}
                </Text> */}
              </Flex>
              <Flex
                width="100%"
                direction="column"
                justify="between"
                align="end"
              >
                <Flex position="relative" width="24px" height="24px">
                  <Image
                    className="border-radius-full"
                    width={24}
                    height={24}
                    alt="Token logo"
                    src={tokenItem?.logoURI}
                  />
                </Flex>
                <Text size="1" mt="1">
                  12,344 {tokenItem.name}
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
            >{`About ${tokenItem.name}`}</Text>
            <Text size="1">{tokenItem.extensions?.description}</Text>
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
                <Link
                  href={`${tokenItem?.extensions?.telegram}`}
                  target="_blank"
                >
                  <Icon icon="telegram" width={16} height={16} />
                </Link>
                <Link
                  href={`${tokenItem?.extensions?.twitter}`}
                  target="_blank"
                >
                  <Icon icon="twitter" width={16} height={16} />
                </Link>
                <Link
                  href={`${tokenItem?.extensions?.website}`}
                  target="_blank"
                >
                  <Icon icon="monitor" width={16} height={16} />
                </Link>
              </Flex>
            </Flex>

            <Flex direction="row" justify="between" align="center">
              <Flex direction="row" gap="1">
                <Icon icon="chartPie" width={14} height={14} />
                <Text size="1" weight="medium">
                  Market cap
                </Text>
              </Flex>
              <Text size="1">{formatCashNumber().format(tokenItem?.mc)}</Text>
            </Flex>
            <Flex direction="row" justify="between" align="center">
              <Flex direction="row" gap="1">
                <Icon icon="chartBar" width={14} height={14} />
                <Text size="1" weight="medium">
                  24H volume
                </Text>
              </Flex>
              <Text size="1">
                {formatCashNumber().format(tokenItem?.v24hUSD)}
              </Text>
            </Flex>
            <Flex direction="row" justify="between" align="center">
              <Flex direction="row" gap="1">
                <Icon icon="chartLine" width={14} height={14} />
                <Text size="1" weight="medium">
                  Liquidity
                </Text>
              </Flex>
              <Text size="1">
                {formatCashNumber().format(tokenItem?.liquidity)}
              </Text>
            </Flex>
            <Flex direction="row" justify="between" align="center">
              <Flex direction="row" gap="1">
                <Icon icon="coins" width={14} height={14} />
                <Text size="1" weight="medium">
                  Total supply
                </Text>
              </Flex>
              <Text size="1">
                {formatNumberToUsFormat().format(tokenItem?.supply)}
              </Text>
            </Flex>
            <Flex direction="row" justify="between" align="center">
              <Flex direction="row" gap="1">
                <Icon icon="wallet" width={14} height={14} stroke={'2'} />
                <Text size="1" weight="medium">
                  Holders
                </Text>
              </Flex>
              <Text size="1">
                {formatNumberToUsFormat().format(tokenItem?.holder)}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </>
  ) : null;
};
