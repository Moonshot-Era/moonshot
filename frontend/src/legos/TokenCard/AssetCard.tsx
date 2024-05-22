import Image from 'next/image';
import React, { FC } from 'react';
import { Flex, Text } from '@radix-ui/themes';

import './style.scss';
import { Icon } from '../Icon';
import { TokenItemBirdEyeType } from '@/@types/birdeye';
import { TokenAttributes, TokenItemGeckoType } from '@/@types/gecko';
import { formatNumberToUsd } from '@/helpers/helpers';

interface Props {
  token: TokenAttributes;
  asset: TokenItemBirdEyeType;
  handler?: () => void;
}

export const AssetCard: FC<Props> = ({ token, asset, handler }) => {
  const {
    address,
    balance,
    chainId,
    decimals,
    logoURI,
    name,
    priceUsd,
    symbol,
    uiAmount,
    valueUsd,
  } = asset;
  console.log('debug > token===', token);
  return (
    <Flex
      direction="row"
      justify="between"
      align="center"
      p="3"
      className="token-card  bg-white"
      onClick={handler}
    >
      {/* {isLabel ? (
        <Flex className="token-card-label bg-warning">
          🔥🔥🔥
          <div className="token-card-label-shadow bg-dark"></div>
        </Flex>
      ) : null} */}
      <Flex direction="row">
        <Flex position="relative">
          <Image alt="img" width={50} height={50} src={logoURI} />
        </Flex>
        <Flex direction="column" justify="between" ml="2" my="1">
          <Text size="3" weight="medium">
            {name}
          </Text>
          <Text size="1" weight="regular">
            {uiAmount} {symbol}
          </Text>
        </Flex>
      </Flex>
      <Flex direction="row" align="center" my="1">
        <Flex direction="column" justify="between" align="end" height="40px">
          <Text size="3" weight="medium">
            {formatNumberToUsd.format(valueUsd)}
          </Text>
          <Flex direction="row" align="center" gap="1">
            <div
              className={
                valueUsd > 0 ? 'icon-success-color' : 'icon-error-color'
              }
            >
              <Icon
                icon={valueUsd > 0 ? 'trendingUp' : 'trendingDown'}
                width={16}
                height={16}
              />
            </div>
            <Text size="1" weight="medium">{`${valueUsd}%`}</Text>
          </Flex>
        </Flex>
        <Icon icon="chevronRight" />
      </Flex>
    </Flex>
  );
};
