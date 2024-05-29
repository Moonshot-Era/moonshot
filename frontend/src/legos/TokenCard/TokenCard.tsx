import React from 'react';
import { Flex, Text } from '@radix-ui/themes';

import './style.scss';
import { Icon } from '../Icon';
import { TokenItemBirdEyeType } from '@/@types/birdeye';
import { formatNumberToUsd, tokenAddressWithDots } from '@/helpers/helpers';
import { PoolAttributes, PoolGeckoType } from '@/@types/gecko';
import { WalletPortfolioAssetType } from '@/services/birdeye/getWalletPortfolio';

interface Props {
  token: PoolGeckoType;
  onClick: () => void;
}

export const TokenCard = ({ onClick, token }: Props) => {
  const tokenItem = token?.attributes;
  const percentageChange = +(tokenItem?.price_change_percentage?.h24 || 0);

  const name = token.included?.attributes.name;

  return (
    <Flex
      direction="row"
      justify="between"
      align="center"
      p="3"
      className="token-card  bg-white"
      onClick={onClick}
    >
      <Flex direction="row">
        {token?.included?.attributes.image_url && (
          <Flex position="relative">
            <img
              alt="img"
              width={50}
              height={50}
              src={token?.included?.attributes.image_url}
              className="token-card-img"
            />
          </Flex>
        )}
        <Flex direction="column" justify="between" ml="2" my="1">
          <Text size="3" weight="medium">
            {/* @ts-ignore */}
            {name}
          </Text>
          <Text size="1" weight="regular">
            {tokenItem ? tokenAddressWithDots(tokenItem?.address) : name}
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
