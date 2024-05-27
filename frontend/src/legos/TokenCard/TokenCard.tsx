import Image from 'next/image';
import React, { FC } from 'react';
import { Flex, Text } from '@radix-ui/themes';

import './style.scss';
import { Icon } from '../Icon';
import { formatNumberToUsd, tokenAddressWithDots } from '@/helpers/helpers';
import { PoolGeckoType } from '@/@types/gecko';

interface Props {
  token?: PoolGeckoType;
  handler?: () => void;
}

export const TokenCard: FC<Props> = ({ token, handler }) => {
  return (
    <Flex
      direction="row"
      justify="between"
      align="center"
      p="3"
      className="token-card  bg-white"
      onClick={handler}
    >
      <Flex direction="row">
        {/* <Flex position="relative">
          {!!token?.imageUrl && (
            <Image
              alt="img"
              width={50}
              height={50}
              src={token?.imageUrl}
              style={{ borderRadius: '50%' }}
            />
          )}
        </Flex> */}
        <Flex direction="column" justify="between" ml="2" my="1">
          <Text size="3" weight="medium">
            {token?.attributes?.name}
          </Text>
          {token?.attributes?.address && (
            <Text size="1" weight="regular">
              {tokenAddressWithDots(token.attributes.address)}
            </Text>
          )}
        </Flex>
      </Flex>
      <Flex direction="row" align="center" my="1">
        {!!token?.attributes?.base_token_price_usd && (
          <Flex direction="column" justify="between" align="end" height="40px">
            <Text size="3" weight="medium">
              {formatNumberToUsd(4).format(
                +token?.attributes?.base_token_price_usd
              )}
            </Text>
            {token?.attributes?.price_change_percentage?.h24 && (
              <Flex direction="row" align="center" gap="1">
                <div
                  className={
                    +token.attributes.price_change_percentage.h24 > 0
                      ? 'icon-success-color'
                      : 'icon-error-color'
                  }
                >
                  <Icon
                    icon={
                      +token.attributes.price_change_percentage.h24 > 0
                        ? 'trendingUp'
                        : 'trendingDown'
                    }
                    width={16}
                    height={16}
                  />
                </div>
                <Text
                  className={
                    +token.attributes.price_change_percentage.h24 > 0
                      ? 'text-color-success'
                      : 'text-color-error'
                  }
                  size="1"
                  weight="medium"
                >{`${+token.attributes.price_change_percentage.h24}%`}</Text>
              </Flex>
            )}
          </Flex>
        )}
        <Icon icon="chevronRight" />
      </Flex>
    </Flex>
  );
};
