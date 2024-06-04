import React from 'react';
import { Flex, Text } from '@radix-ui/themes';

import './style.scss';
import { Icon } from '../Icon';
import { formatNumberToUsd, tokenAddressWithDots } from '@/helpers/helpers';
import { PoolGeckoType } from '@/@types/gecko';

interface Props {
  token: PoolGeckoType;
  onClick: () => void;
  searchTo?: string;
}

export const TokenCard = ({ onClick, token, searchTo }: Props) => {
  const tokenItem = token?.attributes;
  const percentageChange = +(tokenItem?.price_change_percentage?.h24 || 0);
  const name = token.included?.attributes?.name;

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
      <Flex direction="row">
        {token?.included?.attributes.image_url?.includes('http') && (
          <Flex position="relative" width="50px" height="50px">
            <img
              alt="img"
              width={50}
              height={50}
              src={token?.included?.attributes.image_url}
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
            <Text size="3" weight="medium" wrap="nowrap">
              {name?.slice(0, 40)}
              {name?.length > 40 ? '...' : ''}
            </Text>
          )}
          <Text size="1" weight="regular" wrap="nowrap">
            {tokenAddressWithDots(
              token?.relationships?.base_token?.data?.id.replace('solana_', '')
            )}
          </Text>
        </Flex>
      </Flex>
      <Flex direction="row" align="center" my="1">
        <Flex direction="column" justify="between" align="end" height="40px">
          <Text size="3" weight="medium">
            {formatNumberToUsd(4).format(+tokenItem?.base_token_price_usd || 0)}
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
                size="1"
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
