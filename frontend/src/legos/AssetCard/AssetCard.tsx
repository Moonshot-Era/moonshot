import { Flex, Text } from '@radix-ui/themes';
import Image from 'next/image';
import { FC } from 'react';

import { WalletPortfolioAssetType } from '@/services/helius/getWalletPortfolio';
import { Icon } from '../Icon';
import { useWidth } from '@/hooks/useWidth';
import { TokenPrice } from '../TokenPrice/TokenPrice';

interface Props {
  asset?: WalletPortfolioAssetType;
  onClick?: () => void;
}

export const AssetCard: FC<Props> = ({ asset, onClick }) => {
  const { mdScreen } = useWidth();
  return (
    <Flex
      direction="row"
      justify="between"
      align="center"
      p="3"
      className="token-card  bg-white"
      onClick={onClick}
    >
      {asset?.percentage_change_h24 && +asset.percentage_change_h24 > 100 ? (
        <Flex className="token-card-label bg-warning">
          {(+asset.percentage_change_h24 > 100 && '🔥') ||
            (+asset.percentage_change_h24 > 1000 && '🔥🔥') ||
            (+asset.percentage_change_h24 > 1000 && '🔥🔥🔥')}
          <div className="token-card-label-shadow bg-dark"></div>
        </Flex>
      ) : null}
      <Flex direction="row">
        <Flex position="relative" flexShrink="0">
          {asset?.imageUrl && (
            <Image
              alt="img"
              width={50}
              height={50}
              src={asset?.imageUrl}
              style={{ borderRadius: '50%', height: 50, width: 50 }}
            />
          )}
        </Flex>
        <Flex direction="column" justify="between" ml="2" my="1">
          <Text size={mdScreen ? '4' : '3'} weight="medium">
            {asset?.name}
          </Text>
          <Text size={mdScreen ? '3' : '1'} weight="regular">
            {asset?.uiAmount} {asset?.symbol}
          </Text>
        </Flex>
      </Flex>
      <Flex direction="row" align="center" my="1">
        {!!asset?.valueUsd && (
          <Flex direction="column" justify="between" align="end" height="40px">
            <Text size={mdScreen ? '4' : '3'} weight="medium">
              <TokenPrice price={`${asset?.valueUsd}`} />
            </Text>
            {asset?.percentage_change_h24 && (
              <Flex direction="row" align="center" gap="1">
                <div
                  className={
                    +asset?.percentage_change_h24 > 0
                      ? 'icon-success-color'
                      : 'icon-error-color'
                  }
                >
                  <Icon
                    icon={
                      +asset?.percentage_change_h24 > 0
                        ? 'trendingUp'
                        : 'trendingDown'
                    }
                    width={16}
                    height={16}
                  />
                </div>
                <Text
                  className={
                    +asset?.percentage_change_h24 > 0
                      ? 'text-color-success'
                      : 'text-color-error'
                  }
                  size={mdScreen ? '3' : '1'}
                  weight="medium"
                >{`${+asset?.percentage_change_h24}%`}</Text>
              </Flex>
            )}
          </Flex>
        )}
        <Icon icon="chevronRight" />
      </Flex>
    </Flex>
  );
};
