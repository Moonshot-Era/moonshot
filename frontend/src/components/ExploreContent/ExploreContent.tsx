'use client';

import {
  ChangeEvent,
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import { useRouter } from 'next/navigation';
import { Box, Flex, Spinner } from '@radix-ui/themes';
import debounce from 'lodash.debounce';

import { Input, TokenCard } from '@/legos';
import { PoolGeckoType } from '@/@types/gecko';
import { useSearchPools } from '@/hooks/useSearchPools';
import { usePoolsList } from '@/hooks/useTrendingPoolsList';

import './style.scss';
import { Skeleton } from '../Skeleton/Skeleton';

export const ExploreContent = () => {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const {
    poolsList,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchedAfterMount: poolListFetching
  } = usePoolsList();
  const {
    searchPools,
    fetchNextPage: searchFetchNextPage,
    hasNextPage: searchHasNextPage,
    isFetching,
    refetch: searchRefetch
  } = useSearchPools(search);

  const scrollerRef: MutableRefObject<HTMLDivElement | null> =
    useRef<HTMLDivElement | null>(null);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

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
    debounce(async (searchQuery, refetchQuery = false) => {
      if (refetchQuery) {
        scrollerRef?.current?.scroll({ top: 0, behavior: 'smooth' });
        await searchRefetch(searchQuery);
      } else {
        await searchFetchNextPage(searchQuery);
      }
    }, 300),
    [searchFetchNextPage]
  );

  useEffect(() => {
    if (search) {
      debouncedSearchPools(search, true);
    }
  }, [search]);

  const debouncedFetchNextPage = useCallback(
    debounce(async () => {
      await fetchNextPage();
    }, 300),
    [fetchNextPage]
  );

  const handleTokensListScroll = useCallback(
    async (event: React.UIEvent<HTMLElement>) => {
      const target = event.target as HTMLElement;
      const { scrollTop, scrollHeight, clientHeight } = target;

      if (scrollHeight - scrollTop <= clientHeight * 1.5) {
        if ((search && searchPools?.length && searchHasNextPage) || search) {
          await debouncedSearchPools(search);
        } else if (hasNextPage) {
          await debouncedFetchNextPage();
        }
      }
    },
    [
      debouncedFetchNextPage,
      debouncedSearchPools,
      hasNextPage,
      search,
      searchHasNextPage,
      searchPools?.length
    ]
  );

  useEffect(() => {
    const scroller = scrollerRef.current;
    const handleScroll = (event: Event) => {
      if (handleTokensListScroll) {
        handleTokensListScroll(event as unknown as React.UIEvent<HTMLElement>);
      }
    };

    if (scroller) {
      scroller.addEventListener('scroll', handleScroll);
      scroller.addEventListener('touchmove', handleScroll);
    }

    return () => {
      if (scroller) {
        scroller.removeEventListener('scroll', handleScroll);
        scroller.removeEventListener('touchmove', handleScroll);
      }
    };
  }, [handleTokensListScroll]);

  return !poolListFetching ? (
    <Skeleton variant="explore" />
  ) : (
    <Flex
      className="main-wrapper explore-wrapper"
      direction="column"
      align="center"
      justify="center"
      width="100%"
    >
      <Flex
        width="100%"
        height="100%"
        direction="column"
        gap="4"
        position="relative"
      >
        <Box pr="2">
          <Input
            placeholder="Search assets"
            type="search"
            icon="search"
            value={search}
            onChange={handleSearchChange}
          />
        </Box>
        <Flex
          ref={scrollerRef}
          width="100%"
          direction="column"
          gap="4"
          overflow="auto"
          pr="3"
          pb="2"
        >
          {isFetching && (
            <Flex
              className="sticky-spinner"
              top="0"
              align="center"
              justify="center"
            >
              <Spinner size="3" />
            </Flex>
          )}
          {search && searchPools?.length
            ? searchPools?.map((pool) => (
                <TokenCard
                  key={pool?.id}
                  token={pool}
                  onClick={() => handleGoToDetails(pool)}
                />
              ))
            : poolsList?.map((pool) => (
                <TokenCard
                  key={pool?.id}
                  token={pool}
                  onClick={() => handleGoToDetails(pool)}
                />
              ))}
          {(isFetchingNextPage || isFetching) && (
            <Flex
              className="sticky-spinner"
              align="center"
              justify="center"
              pb="5"
            >
              <Spinner size="3" />
            </Flex>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};
