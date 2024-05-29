import axios from 'axios';

import { PoolGeckoType } from '@/@types/gecko';

export const fetchSearchPools = (query: string): Promise<PoolGeckoType[]> =>
  axios
    .post(`${process.env.NEXT_PUBLIC_SITE_URL}/api/gecko/search-pools`, {
      query,
    })
    .then((response) => response.data.searchPoolsData.data);
