import {
  useState,
} from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  GeckoTokenIncluded,
  GeckoTokenOverview,
  PoolGeckoType
} from '@/@types/gecko';

export const fetchPoolsList = (page: number, withTokensOverview: boolean): Promise<PoolGeckoType[]> =>
  axios
    .post(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/gecko/get-trending-pools?page=${page}`,
      { page, withTokensOverview }
    )
    .then((response) => {
      return response?.data?.trendingPools?.data.map(
        (tokenData: PoolGeckoType) => ({
          ...tokenData,
          included: response?.data?.trendingPools?.included.find(
            ({ id }: GeckoTokenIncluded) => {
              return id === tokenData.relationships.base_token.data.id;
            }
          ),
          tokenOverview:
            response?.data?.trendingPools?.tokensOverview?.data.find(
              (overview: GeckoTokenOverview) => {
                return (
                  overview?.id === tokenData.relationships.base_token.data.id
                );
              }
            )
        })
      );
    });

export const usePoolsList = (withTokensOverview: boolean = true) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, ...rest } =
    useInfiniteQuery({
      initialPageParam: 1,
      queryKey: ['trendingPoolsList'],
      queryFn: async ({ pageParam = 1 }) => await fetchPoolsList(pageParam, withTokensOverview),
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = allPages.length + 1;
        return nextPage <= 10 ? nextPage : undefined;
      }
    });
  
  return {
    poolsList: data?.pages.flat(),
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    ...rest
  };
};
