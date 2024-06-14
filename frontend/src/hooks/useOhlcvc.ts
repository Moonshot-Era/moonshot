import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const fetchOhlcv = (
  poolAddress: string,
  timeFrame: string,
  aggregateParam: string,
  beforeTimestamp?: number,
) =>
  axios
    .post(`${process.env.NEXT_PUBLIC_SITE_URL}/api/ohlcv`, {
      poolAddress,
      timeFrame,
      aggregateParam,
      beforeTimestamp,
    })
    .then((response) => {
      return response.data.data;
    });

export const useOhlcv = (
  poolAddress?: string,
  timeFrame: string = 'hour',
  aggregateParam: string = '1',
  beforeTimestamp?: number,
) => {
  const { data, ...rest } = useInfiniteQuery({
    initialPageParam: 1,
    queryKey: ['ohlcv', timeFrame, aggregateParam],
    enabled: !!poolAddress,
    queryFn: () => {
      return fetchOhlcv(poolAddress!, timeFrame, aggregateParam, beforeTimestamp);
    },
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return nextPage <= 15 ? nextPage : undefined;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  return {
    ohlcv: data?.pages?.flat()
      .map((page) => page?.attributes?.ohlcv_list)
      .flat()
      .filter(val => val)
      .map((item: Array<number[]>) => ({
        time: +item[0],
        value: item[4]
      })),
    ...rest
  };
};
