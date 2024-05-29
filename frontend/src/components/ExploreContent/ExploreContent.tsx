'use client';

import Image from 'next/image';
import { Flex } from '@radix-ui/themes';

import './style.scss';

import { Icon, Input, TokenCard } from '@/legos';
import { PoolGeckoType } from '@/@types/gecko';
import { useRouter } from 'next/navigation';

// TODO list
// add link for token card
// add search from gecko
// add hook global for assets
// get token info on culture page
// check if user has balance
// connect share
// create public route for culture
// add images from included


export const ExploreContent = ({
  trendingPools,
}: {
  trendingPools: PoolGeckoType[];
}) => {
  const router = useRouter();
  const handleGoToDetails = (pool: PoolGeckoType) => {
    if (pool?.attributes?.name) {
      router.push(
        `/culture/${pool?.attributes?.name.replace(
          /\W/g,
          ''
        )}?tokenAddress=${pool?.relationships?.base_token?.data?.id.replace(
          'solana_',
          ''
        )}`
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
