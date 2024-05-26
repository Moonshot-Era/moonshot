import Image from 'next/image';
import React, { FC } from 'react';
import { Flex, Text } from '@radix-ui/themes';

import './style.scss';
import { Icon } from '../Icon';
import { currencyFormatter } from '@/helpers/currencyFormatter';
import { formatNumberToUsd } from '@/helpers/helpers';
import { WalletPortfolioAssetType } from '@/services/birdeye/getWalletPortfolio';


interface Props {
  token?: WalletPortfolioAssetType;
  name: string;
  logoSrc: string;
  description: string;
  percent: number;
  total: number;
  isLabel?: boolean;
  currencyType: string;
  onClick?: () => void;
  type?: 'default' | 'convert';
}

export const TokenCard: FC<Props> = ({
  name,
  percent,
  total,
  description,
  isLabel,
  logoSrc,
  type = 'default',
  onClick,
  token,
}) => {
  const percentChange = percent ? (+percent).toFixed(2) : null

  return (
    <Flex
      direction="row"
      justify="between"
      align="center"
      p="3"
      className="token-card  bg-white"
      onClick={onClick}
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
        {(token?.imageUrl || token?.logoURI) && (
          <Flex position="relative">
            <img alt="img" width={50} height={50} src={token?.imageUrl || token?.logoURI} className="token-card-img" />
          </Flex>
        )}
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
