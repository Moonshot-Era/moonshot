import React from 'react';
import { Flex, Text } from '@radix-ui/themes';

import './style.scss';
import { Icon } from '../Icon';
import { TokenItemBirdEyeType } from '@/@types/birdeye';
import { formatNumberToUsd } from '@/helpers/helpers';

interface Props {
  token: TokenItemBirdEyeType;
  onClick: () => void;
}

export const TokenCard = ({ onClick, token }: Props) => {
  // const percentageChange = +token?.attributes?.price_change_percentage?.h24

  return (
    <Flex
      direction="row"
      justify="between"
      align="center"
      p="3"
      className="token-card  bg-white"
      onClick={onClick}
    >
      {/* {percentageChange && percentageChange > 100 ? (
        <Flex className="token-card-label bg-warning">
          {(percentageChange > 100 && "🔥") ||
            (percentageChange > 1000 && "🔥🔥") ||
            (percentageChange > 1000 && "🔥🔥🔥")}
          <div className="token-card-label-shadow bg-dark"></div>
        </Flex>
      ) : null} */}
      <Flex direction="row">
        {/* {(token?.imageUrl || token?.logoURI) && (
          <Flex position="relative">
            <img
              alt="img"
              width={50}
              height={50}
              src={token?.imageUrl || token?.logoURI}
              className="token-card-img"
            />
          </Flex>
        )} */}
        <Flex direction="column" justify="between" ml="2" my="1">
          <Text size="3" weight="medium">
            {/* @ts-ignore */}
            {token?.name || token?.attributes?.name}
          </Text>
          {/* <Text size="1" weight="regular">
            {token?.uiAmount} {token?.symbol}
          </Text> */}
        </Flex>
      </Flex>
      <Flex direction="row" align="center" my="1">
        {!!token?.valueUsd && (
          <Flex direction="column" justify="between" align="end" height="40px">
            <Text size="3" weight="medium">
              {formatNumberToUsd(token?.decimals).format(token?.valueUsd)}
            </Text>
            {/* {percentageChange && (
              <Flex direction="row" align="center" gap="1">
                <div
                  className={
                    percentageChange > 0
                      ? "icon-success-color"
                      : "icon-error-color"
                  }
                >
                  <Icon
                    icon={
                      percentageChange > 0
                        ? "trendingUp"
                        : "trendingDown"
                    }
                    width={16}
                    height={16}
                  />
                </div>
                <Text
                  className={
                    percentageChange > 0
                      ? "text-color-success"
                      : "text-color-error"
                  }
                  size="1"
                  weight="medium"
                >{`${percentageChange}%`}</Text>
              </Flex>
            )} */}
          </Flex>
        )}
        <Icon icon="chevronRight" />
      </Flex>
    </Flex>
  );
};
