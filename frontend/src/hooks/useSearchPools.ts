import axios from 'axios';
import { useInfiniteQuery } from '@tanstack/react-query';

import { GeckoTokenIncluded, PoolGeckoType } from '@/@types/gecko';

const fetchSearchPools = (
  query: string,
  page: number = 1
): Promise<PoolGeckoType[]> =>
  axios
    .post(`${process.env.NEXT_PUBLIC_SITE_URL}/api/gecko/search-pools`, {
      query,
      page
    })
    .then((response) =>
      response.data?.searchPoolsData?.data?.map((tokenData: PoolGeckoType) => ({
        ...tokenData,
        included: response?.data?.searchPoolsData?.included.find(
          ({ id }: GeckoTokenIncluded) => {
            return id === tokenData.relationships.base_token.data.id;
          }
        )
      }))
    );

export const useSearchPools = (query: string) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, ...rest } =
    useInfiniteQuery({
      initialPageParam: 1,
      queryKey: [`searchPoolsList-${query}`],
      enabled: !!query,
      queryFn: async ({ pageParam = 1 }) =>
        await fetchSearchPools(query, pageParam),
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = allPages.length + 1;
        return nextPage <= 10 ? nextPage : undefined;
      }
    });
  return {
    searchPools: data?.pages.flat(),
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    ...rest
  };
};
