import { useQuery } from '@tanstack/react-query';

import { fetchSearchPools } from '@/utils/searchPools';

export const useSearchPools = (query?: string) => {
  const { data, ...rest } = useQuery({
    queryKey: ['search-pools'],
    queryFn: () => {
      if (!query) {
        return [];
      } else {
        return fetchSearchPools(query);
      }
    },
  });
  console.log('debug > data===', data);
  return { searchPools: data, ...rest };
};
