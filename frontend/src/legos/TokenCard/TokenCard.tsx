import Image from 'next/image';
import React, { FC } from 'react';
import { Flex, Text } from '@radix-ui/themes';

import './style.scss';
import { Icon } from '../Icon';
import { formatNumberToUsd } from '@/helpers/helpers';
import { WalletPortfolioDetailsType } from '@/services/birdeye/getWalletPortfolio';

interface Props {
  token?: WalletPortfolioDetailsType;
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
      {token?.percentage_change_h24 && +token.percentage_change_h24 > 100 ? (
        <Flex className="token-card-label bg-warning">
          {(+token.percentage_change_h24 > 100 && '🔥') ||
            (+token.percentage_change_h24 > 1000 && '🔥🔥') ||
            (+token.percentage_change_h24 > 1000 && '🔥🔥🔥')}
          <div className="token-card-label-shadow bg-dark"></div>
        </Flex>
      ) : null}
      <Flex direction="row">
        <Flex position="relative">
          {!!token?.imageUrl && (
            <Image
              alt="img"
              width={50}
              height={50}
              src={token?.imageUrl}
              style={{ borderRadius: '50%' }}
            />
          )}
        </Flex>
        <Flex direction="column" justify="between" ml="2" my="1">
          <Text size="3" weight="medium">
            {token?.name}
          </Text>
          <Text size="1" weight="regular">
            {token?.uiAmount} {token?.symbol}
          </Text>
        </Flex>
      </Flex>
      <Flex direction="row" align="center" my="1">
        {!!token?.valueUsd && (
          <Flex direction="column" justify="between" align="end" height="40px">
            <Text size="3" weight="medium">
              {formatNumberToUsd.format(token?.valueUsd)}
            </Text>
            {token?.percentage_change_h24 && (
              <Flex direction="row" align="center" gap="1">
                <div
                  className={
                    +token?.percentage_change_h24 > 0
                      ? 'icon-success-color'
                      : 'icon-error-color'
                  }
                >
                  <Icon
                    icon={
                      +token?.percentage_change_h24 > 0
                        ? 'trendingUp'
                        : 'trendingDown'
                    }
                    width={16}
                    height={16}
                  />
                </div>
                <Text
                  className={
                    +token?.percentage_change_h24 > 0
                      ? 'text-color-success'
                      : 'text-color-error'
                  }
                  size="1"
                  weight="medium"
                >{`${+token?.percentage_change_h24}%`}</Text>
              </Flex>
            )}
          </Flex>
        )}
        <Icon icon="chevronRight" />
      </Flex>
    </Flex>
  );
};
