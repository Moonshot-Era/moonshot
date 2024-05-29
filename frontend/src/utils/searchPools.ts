import axios from 'axios';

import { GeckoTokenIncluded, PoolGeckoType } from '@/@types/gecko';

export const fetchSearchPools = (query: string): Promise<PoolGeckoType[]> =>
  axios
    .post(`${process.env.NEXT_PUBLIC_SITE_URL}/api/gecko/search-pools`, {
      query
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
