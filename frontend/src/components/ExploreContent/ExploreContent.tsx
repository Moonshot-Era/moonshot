'use client';

import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Flex } from '@radix-ui/themes';
import debounce from 'lodash.debounce';

import { Input, TokenCard } from '@/legos';
import { PoolGeckoType } from '@/@types/gecko';
import { useSearchPools } from '@/hooks/useSearchPools';

import './style.scss';

// TODO list
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
  const [search, setSearch] = useState('');

  const { searchPools, refetch } = useSearchPools(search);
  console.log('debug > searchPools===', searchPools);
  const handleGoToDetails = (pool: PoolGeckoType) => {
    if (pool?.attributes?.name) {
      router.push(
        `/culture/${pool?.relationships?.base_token?.data?.id.replace(
          'solana_',
          ''
        )}`
      );
    }
  };

  const debouncedSearchPools = useCallback(
    debounce(async (searchQuery) => {
      await refetch(searchQuery);
    }, 300),
    []
  );

  useEffect(() => {
    if (search) {
      debouncedSearchPools(search);
    }
  }, [search]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
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
          <Input
            placeholder="Search assets"
            icon="search"
            onChange={handleSearchChange}
          />
          {searchPools?.length
            ? searchPools?.map((pool, index) =>
                pool ? (
                  <TokenCard
                    key={index}
                    token={pool}
                    onClick={() => handleGoToDetails(pool)}
                  />
                ) : null
              )
            : trendingPools?.map((pool, index) =>
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
