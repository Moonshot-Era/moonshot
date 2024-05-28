'use client';

import Image from 'next/image';
import { Flex } from '@radix-ui/themes';

import './style.scss';

import { Icon, Input, TokenCard } from '@/legos';
import { PoolGeckoType } from '@/@types/gecko';
import { useRouter } from 'next/navigation';

export const ExploreContent = ({
  trendingPools,
}: {
  trendingPools: PoolGeckoType[];
}) => {
  const router = useRouter();
  const handleGoToDetails = (pool: PoolGeckoType) => {
    if (pool?.attributes?.name) {
      router.push(
        `/culture/${pool?.attributes?.name.replace(/\W/g, '')}?tokenAddress=${
          pool?.attributes?.address
        }`
      );
    }
  };

  return (
    <>
      <Flex
        direction="column"
        align="center"
        justify="center"
        width="100%"
        className="main-wrapper explore-wrapper"
      >
        <Flex width="100%" direction="column" gap="4">
          <Input placeholder="Search assets" icon="search" />
          {trendingPools?.map((pool, index) =>
            pool ? (
              <TokenCard
                key={index}
                token={pool}
                onClick={() => handleGoToDetails(pool)}
              />
            ) : null
          )}
        </Flex>
      </Flex>
    </>
  );
};
