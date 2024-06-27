'use client';

import { ChangeEvent, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Flex, Spinner } from '@radix-ui/themes';

import { Input, TokenCard } from '@/legos';
import { PoolGeckoType } from '@/@types/gecko';
import { useSearchPools } from '@/hooks/useSearchPools';
import { usePoolsList } from '@/hooks/useTrendingPoolsList';

import './style.scss';
import { SkeletonExploreList } from '../Skeleton/components/SkeletonExplore/SkeletonExploreList';
import InfiniteScroll from 'react-infinite-scroll-component';
import { OverviewTokenSelectedType } from '@/services/helius/getWalletPortfolio';
import { DefaultTokens } from '../DefaultTokens/DefaultTokens';

export const ExploreContent = ({
  showDefault,
  onTokenClick
}: {
  showDefault?: boolean;
  onTokenClick?(token: PoolGeckoType | OverviewTokenSelectedType): void;
}) => {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const scrollDivRef = useRef<HTMLDivElement>(null);

  const {
    poolsList,
    fetchNextPage: trendingPoolsFetchNextPage,
    hasNextPage: trendingPoolsHasNextPage,
    isFetching: isFetchingTrendingPools,
    refetch: trendingPoolsRefetch
  } = usePoolsList();

  const {
    searchPools,
    fetchNextPage: searchFetchNextPage,
    hasNextPage: searchHasNextPage,
    isFetching: isFetchingSearchPools,
    refetch: searchRefetch
  } = useSearchPools(search);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    if ((!search || !event.target.value) && scrollDivRef?.current) {
      scrollDivRef?.current?.scroll({ top: 0, behavior: 'smooth' });
    }
  };

  const handleTokenClick = (pool: PoolGeckoType) => {
    if (pool?.attributes?.name) {
      router.push(
        `/culture/${pool?.relationships?.base_token?.data?.id.replace(
          'solana_',
          ''
        )}`
      );
    }
  };

  return (
    <Flex
      className={`main-wrapper ${
        isFetchingTrendingPools && !poolsList?.length ? '' : 'explore-wrapper'
      }`}
      direction="column"
      align="center"
      justify="center"
      width="100%"
      style={{ paddingTop: showDefault ? '16px' : '70px' }}
    >
      <Flex
        width="100%"
        height="100%"
        direction="column"
        gap="4"
        position="relative"
      >
        <Box
          pr="2"
          mt={
            !showDefault && isFetchingTrendingPools && !poolsList?.length
              ? '70px'
              : '0'
          }
        >
          <Input
            placeholder="Search assets"
            type="search"
            icon="search"
            value={search}
            onChange={handleSearchChange}
          />
        </Box>
        {showDefault && onTokenClick && (
          <DefaultTokens handleTokenSelect={onTokenClick} />
        )}
        <Flex
          id="scrollableDiv"
          ref={scrollDivRef}
          width="100%"
          height={showDefault ? '48%' : '80%'}
          direction="column"
          overflow="auto"
        >
          {isFetchingSearchPools && (
            <Flex align="center" justify="center" pt="3" pb="3">
              <Spinner size="3" />
            </Flex>
          )}
          {isFetchingTrendingPools && !poolsList?.length ? (
            <SkeletonExploreList />
          ) : search && searchPools?.length ? (
            <InfiniteScroll
              dataLength={searchPools?.length}
              next={searchFetchNextPage}
              hasMore={searchHasNextPage}
              scrollableTarget="scrollableDiv"
              loader={
                isFetchingSearchPools ? (
                  <Flex
                    className="sticky-spinner"
                    align="center"
                    justify="center"
                    pt="3"
                    pb="5"
                  >
                    <Spinner size="3" />
                  </Flex>
                ) : null
              }
              endMessage={
                <p style={{ textAlign: 'center' }}>
                  <b>Yay! You have seen it all</b>
                </p>
              }
              refreshFunction={searchRefetch}
              pullDownToRefresh
              pullDownToRefreshThreshold={50}
            >
              <Flex width="100%" direction="column" gap="4" pr="3" pb="2">
                {searchPools?.map((pool) =>
                  pool?.id ? (
                    <TokenCard
                      key={pool?.id}
                      token={pool}
                      onClick={() => {
                        if (onTokenClick) {
                          onTokenClick(pool);
                        } else {
                          handleTokenClick(pool);
                        }
                      }}
                    />
                  ) : null
                )}
              </Flex>
            </InfiniteScroll>
          ) : poolsList?.length ? (
            <InfiniteScroll
              dataLength={poolsList?.length}
              next={trendingPoolsFetchNextPage}
              hasMore={trendingPoolsHasNextPage}
              scrollableTarget="scrollableDiv"
              loader={
                isFetchingTrendingPools ? (
                  <Flex
                    className="sticky-spinner"
                    align="center"
                    justify="center"
                    pt="3"
                    pb="5"
                  >
                    <Spinner size="3" />
                  </Flex>
                ) : null
              }
              refreshFunction={trendingPoolsRefetch}
              pullDownToRefresh
              pullDownToRefreshThreshold={50}
            >
              <Flex width="100%" direction="column" gap="4" pr="3" pb="2">
                {poolsList?.map((pool) =>
                  pool?.id ? (
                    <TokenCard
                      key={pool?.id}
                      token={pool}
                      onClick={() => {
                        if (onTokenClick) {
                          onTokenClick(pool);
                        } else {
                          handleTokenClick(pool);
                        }
                      }}
                    />
                  ) : null
                )}
              </Flex>
            </InfiniteScroll>
          ) : null}
        </Flex>
      </Flex>
    </Flex>
  );
};
