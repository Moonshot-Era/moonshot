"use client";

// TODO:
// + Show available assets to convert
// + Show price change of assets
// + Add input of tokens to convert
// + Add max btn for tokens to convert
// + Find routes for convert in jupiter
// + Convert
// + Infinite scroll for tokens
// + Selects as a btn
// + Show progress
// - show empty state
// - validate number in input
// - Search an asset
// - Price of tokens in tokensList
// - better types
// - Snap on scroll

import {
  FC,
  memo,
  useState,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import "./style.scss";
import { SheetDrawer } from "@/legos";
import { TokensSelect } from "./TokensSelect";
import { ConvertForm } from "./ConvertForm";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { Flex, Spinner } from "@radix-ui/themes";
import debounce from "lodash.debounce";
import {
  WalletPortfolioAssetType,
  WalletPortfolioNormilizedType,
} from '@/services/birdeye/getWalletPortfolio';
import { PoolGeckoType } from '@/@types/gecko';
import { TokenItemBirdEyeType } from '@/@types/birdeye';
import { SelectedTokens } from './types';

type Portfolio = {
  tokens: TokenItemBirdEyeType[];
  total: number;
  updateTime: string;
  updateUnixTime: number;
};
interface Props {
  portfolio: WalletPortfolioNormilizedType;
  isOpen: boolean;
  toggleOpen: () => void;
}

// const fetchPoolsList = ({ pageParam = 1 }): Promise<PoolGeckoType[]> =>
//   axios
//     .post(
//       `${process.env.NEXT_PUBLIC_SITE_URL}/api/gecko/get-trending-pools?page=${pageParam}`
//     )
//     .then((response) => {
//       return response?.data?.trendingPools?.data;
//     });

// const usePoolsList = () => {
//   const [page, setPage] = useState(1);
//   const { data, fetchNextPage, hasNextPage, isFetchingNextPage, ...rest } =
//     useInfiniteQuery({
//       queryKey: ['trendingPoolsList'],
//       queryFn: async () => await fetchPoolsList(page),
//       getNextPageParam: () => {
//         if (page < 10) {
//           setPage(page + 1);
//         }
//         return page < 10 ? page + 1 : undefined;
//       },
//     });

//   return {
//     poolsList: data?.pages?.[0],
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage,
//     ...rest,
//   };
// };

const fetchTokensList = ({ pageParam = 0 }): Promise<Portfolio> =>
  axios
    .post(`${process.env.NEXT_PUBLIC_SITE_URL}/api/birdeye/token-list`, {
      offset: pageParam,
      limit: 50,
    })
    .then((response) => response.data.tokenList.data);

const useTokensList = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, ...rest } =
    useInfiniteQuery({
      initialPageParam: 1,
      queryKey: ['tokensList'],
      queryFn: fetchTokensList,
      getNextPageParam: (lastPage, pages) => {
        if (!lastPage || !pages) {
          return;
        }
        console.log('debug > lastPage===', lastPage);
        const totalTokens = lastPage?.total;
        const nextPage = pages?.length * 50;
        return nextPage < totalTokens ? nextPage : undefined;
      },
    });

  return {
    tokensList: data?.pages?.flatMap((page) => page?.tokens),
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    ...rest,
  };
};

const DEFAULT_TOKENS = {
  from: null,
  to: null,
};

export const ConvertDrawer: FC<Props> = memo(
  forwardRef(function ConvertDrawer({ portfolio }, ref) {
    const [state, setState] = useState<string | null>(null);
    const { tokensList, fetchNextPage, hasNextPage, isFetchingNextPage } =
      useTokensList();
    const [selectedTokens, setSelectedTokens] = useState<
      SelectedTokens | { from: null; to: null }
    >(DEFAULT_TOKENS);
    const handleTokenSelect = (
      token: TokenItemBirdEyeType | WalletPortfolioAssetType
    ) => {
      setSelectedTokens({
        ...selectedTokens,
        [`${state}`]: token,
      });

      if (state === 'from' && !selectedTokens.to) {
        setState('to');
      } else {
        setState('convert');
      }
    };

    const handleClose = () => {
      setState(null);
      setSelectedTokens(DEFAULT_TOKENS);
    };

    useImperativeHandle(
      ref,
      () => {
        return {
          open: () => setState('from'),
          close: () => setState(null),
        };
      },
      []
    );

    const debouncedFetchNextPage = useCallback(
      debounce(async () => {
        if (hasNextPage) {
          await fetchNextPage();
        }
      }, 300),
      [fetchNextPage, hasNextPage]
    );

    const handleTokensListScroll = async (
      event: React.UIEvent<HTMLElement>
    ) => {
      const target = event.target as HTMLElement;
      const { scrollTop, scrollHeight, clientHeight } = target;

      if (scrollHeight - scrollTop <= clientHeight * 1.5) {
        if (hasNextPage) {
          await debouncedFetchNextPage();
        }
      }
    };

    console.log('debug > poolsList===', tokensList);

    if (!portfolio?.walletAssets || !tokensList) {
      return null;
    }

    return (
      <>
        <SheetDrawer
          isOpen={state === 'from'}
          handleClose={handleClose}
          snapPoints={[800, 450]}
          initialSnap={1}
        >
          <TokensSelect
            handleTokenSelect={handleTokenSelect}
            selectMode="from"
            tokensList={portfolio?.walletAssets as WalletPortfolioAssetType[]}
          />
        </SheetDrawer>
        <SheetDrawer
          isOpen={state === 'to'}
          handleClose={handleClose}
          snapPoints={[800, 450]}
          initialSnap={1}
          onScroll={handleTokensListScroll}
        >
          <TokensSelect
            handleTokenSelect={handleTokenSelect}
            selectMode="to"
            tokensList={tokensList as TokenItemBirdEyeType[]}
          />
          {isFetchingNextPage && (
            <Flex align="center" justify="center" pb="5">
              <Spinner size="3" />
            </Flex>
          )}
        </SheetDrawer>
        {selectedTokens?.from && selectedTokens?.to ? (
          <SheetDrawer
            isOpen={state === 'convert'}
            detent="content-height"
            handleClose={handleClose}
          >
            <ConvertForm
              selectedTokens={selectedTokens}
              changeSelected={(reselect) => setState(reselect)}
              closeDrawer={handleClose}
            />
          </SheetDrawer>
        ) : null}
      </>
    );
  })
);
