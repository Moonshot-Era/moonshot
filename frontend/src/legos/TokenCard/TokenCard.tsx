import React from 'react';
import { Flex, Text } from '@radix-ui/themes';

import './style.scss';
import { Icon } from '../Icon';
import { useWidth } from '@/hooks/useWidth';
import { isSolanaAddress, tokenAddressWithDots } from '@/helpers/helpers';
import {
  GeckoTokenIncluded,
  PoolAttributes,
  PoolGeckoType,
  TokenItemGeckoType
} from '@/@types/gecko';
import { TokenPrice } from '../TokenPrice/TokenPrice';

interface Props {
  token: PoolGeckoType | TokenItemGeckoType;
  onClick: () => void;
  searchTo?: string;
  isDefaultToken?: boolean;
}

export const TokenCard = ({
  onClick,
  token,
  searchTo,
  isDefaultToken
}: Props) => {
  const { mdScreen } = useWidth();
  const tokenIncluded = isDefaultToken
    ? token?.included
    : (token?.included as GeckoTokenIncluded);

  const tokenItem = isDefaultToken
    ? {
        ...(token as TokenItemGeckoType)?.attributes,
        price_change_percentage_h24: (tokenIncluded as PoolGeckoType)
          ?.attributes?.price_change_percentage?.h24
      }
    : {
        ...token?.attributes,
        address: (
          token as PoolGeckoType
        )?.relationships?.base_token?.data?.id.replace('solana_', ''),
        price_usd: (token as PoolGeckoType)?.attributes?.base_token_price_usd,
        price_change_percentage_h24: (token as PoolGeckoType)?.attributes
          ?.price_change_percentage?.h24,
        image_url: (
          tokenIncluded as GeckoTokenIncluded
        )?.attributes.image_url?.includes('http')
          ? (tokenIncluded as GeckoTokenIncluded)?.attributes.image_url
          : ''
      };
  const percentageChange = +(tokenItem?.price_change_percentage_h24 || 0);
  const name = isSolanaAddress(tokenItem?.address)
    ? 'SOL'
    : token?.attributes?.name;

  return (
    <Flex
      id={`${token?.id}${searchTo ? `-search` : ''}`}
      direction="row"
      justify="between"
      align="center"
      p="3"
      className="token-card  bg-white"
      onClick={onClick}
    >
      <Flex direction="row" width="100%">
        {tokenItem?.image_url && (
          <Flex position="relative" width="50px" height="50px">
            <img
              alt="img"
              width={50}
              height={50}
              src={tokenItem?.image_url}
              className="token-card-img"
            />
          </Flex>
        )}
        <Flex
          direction="column"
          justify="between"
          ml="2"
          my="1"
          maxWidth="80%"
          overflow="hidden"
        >
          {name && (
            <Text size={mdScreen ? '4' : '3'} weight="medium" wrap="nowrap">
              {name?.slice(0, 40)}
              {name?.length > 40 ? '...' : ''}
            </Text>
          )}
          <Text size={mdScreen ? '3' : '1'} weight="regular" wrap="nowrap">
            {tokenAddressWithDots(tokenItem?.address)}
          </Text>
        </Flex>
      </Flex>
      <Flex direction="row" align="center" my="1">
        <Flex direction="column" justify="between" align="end" height="40px">
          <Text size={mdScreen ? '4' : '3'} weight="medium">
            <TokenPrice price={`${tokenItem?.price_usd}`} />
          </Text>
          {percentageChange && (
            <Flex direction="row" align="center" gap="1">
              <div
                className={
                  percentageChange > 0
                    ? 'icon-success-color'
                    : 'icon-error-color'
                }
              >
                <Icon
                  icon={percentageChange > 0 ? 'trendingUp' : 'trendingDown'}
                  width={16}
                  height={16}
                />
              </div>
              <Text
                className={
                  percentageChange > 0
                    ? 'text-color-success'
                    : 'text-color-error'
                }
                size={mdScreen ? '3' : '1'}
                weight="medium"
              >{`${percentageChange}%`}</Text>
            </Flex>
          )}
        </Flex>
        <Icon icon="chevronRight" />
      </Flex>
    </Flex>
  );
};
