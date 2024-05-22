import Image from 'next/image';
import React, { FC } from 'react';
import { Flex, Text } from '@radix-ui/themes';

import './style.scss';
import { Icon } from '../Icon';
import { currencyFormatter } from '@/helpers/currencyFormatter';

interface Props {
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
      {isLabel ? (
        <Flex className="token-card-label bg-warning">
          🔥🔥🔥
          <div className="token-card-label-shadow bg-dark"></div>
        </Flex>
      ) : null}
      <Flex direction="row">
        {type === 'convert' && (
          <Flex position="relative">
            <img alt="img" width={50} height={50} src={logoSrc} className="token-card-img" />
          </Flex>
        )}
        <Flex direction="column" justify="between" ml="2" my="1">
          <Text size="3" weight="medium">
            {name}
          </Text>
          <Text size="1" weight="regular">
            {description}
          </Text>
        </Flex>
      </Flex>
      <Flex direction="row" align="center" my="1">
        <Flex direction="column" justify="between" align="end" height="40px">
          <Text size="3" weight="medium">{currencyFormatter(total, { minimumFractionDigits: type === 'default' ? 0 : 4 })}</Text>
          {percentChange && (
            <Flex direction="row" align="center" gap="1">
              <Flex
                direction="row"
                align="center"
                justify="center"
                className={percentChange > 0 ? 'icon-success-color' : 'icon-error-color'}
              >
                <Icon
                  icon={percentChange > 0 ? 'trendingUp' : 'trendingDown'}
                  width={16}
                  height={16}
                />
                <Text
                  size="1"
                  weight="medium"
                  className={percentChange > 0 ? 'text-success-color' : 'text-error-color'}
                >
                  {`${percentChange}%`}
                </Text>
              </Flex>
            </Flex>
          )}
        </Flex>
        <Icon icon="chevronRight" />
      </Flex>
    </Flex>
  );
};
