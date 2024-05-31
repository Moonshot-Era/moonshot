'use client';

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
// + Search an asset
// + Price of tokens in tokensList
// + better types
// - Snap on scroll

import {
  FC,
  memo,
  useState,
  forwardRef,
  useImperativeHandle,
  useCallback,
  useEffect
} from 'react';
import './style.scss';
import { SheetDrawer } from '@/legos';
import { TokensSelect } from './TokensSelect';
import { ConvertForm } from './ConvertForm';
import { Flex, Spinner } from '@radix-ui/themes';
import debounce from 'lodash.debounce';
import {
  WalletPortfolioAssetType,
  WalletPortfolioNormilizedType
} from '@/services/birdeye/getWalletPortfolio';
import { PoolGeckoType } from '@/@types/gecko';
import { SelectedTokens } from './types';
import { usePoolsList } from '@/hooks/useTrendingPoolsList';
import { useSearchPools } from '@/hooks/useSearchPools';

interface Props {
  portfolio: WalletPortfolioNormilizedType;
  isOpen: boolean;
  toggleOpen: () => void;
}

const DEFAULT_TOKENS = {
  from: null,
  to: null
};

export const ConvertDrawer: FC<Props> = memo(
  forwardRef(function ConvertDrawer({ portfolio }, ref) {
    const [state, setState] = useState<string | null>(null);
    const [searchTo, setSearchTo] = useState('');
    const [scrollToTop, setScrollToTop] = useState(false);
    const [selectedTokens, setSelectedTokens] = useState<
      SelectedTokens | { from: null; to: null }
    >(DEFAULT_TOKENS);
    const { poolsList, fetchNextPage, hasNextPage, isFetchingNextPage } =
      usePoolsList();
    const {
      searchPools,
      fetchNextPage: searchFetchNextPage,
      hasNextPage: searchHasNextPage,
      isFetching: isFetchingSearchPools,
      refetch: searchRefetch
    } = useSearchPools(searchTo);

    const handleTokenSelect = (
      token: WalletPortfolioAssetType | PoolGeckoType
    ) => {
      setSelectedTokens({
        ...selectedTokens,
        [`${state}`]: token
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
          close: () => setState(null)
        };
      },
      []
    );

    const debouncedFetchNextPage = useCallback(
      debounce(async () => {
        await fetchNextPage();
      }, 300),
      [fetchNextPage]
    );

    const debouncedSearchPools = useCallback(
      debounce(async (searchQuery, refetchQuery = false) => {
        if (refetchQuery) {
          await searchRefetch(searchQuery);
        } else {
          await searchFetchNextPage(searchQuery);
        }
      }, 300),
      [searchFetchNextPage]
    );

    const handleTokensListScroll = useCallback(
      async (event: React.UIEvent<HTMLElement>) => {
        const target = event.target as HTMLElement;
        const { scrollTop, scrollHeight, clientHeight } = target;

        if (scrollHeight - scrollTop <= clientHeight * 1.5) {
          if (
            (searchTo && searchPools?.length && searchHasNextPage) ||
            searchTo
          ) {
            debouncedSearchPools(searchTo);
          } else if (hasNextPage) {
            debouncedFetchNextPage();
          }
        }
      },
      [
        debouncedFetchNextPage,
        debouncedSearchPools,
        hasNextPage,
        searchHasNextPage,
        searchPools?.length,
        searchTo
      ]
    );

    useEffect(() => {
      if (searchTo) {
        debouncedSearchPools(searchTo, true);
      }
    }, [debouncedSearchPools, searchTo]);

    if (!portfolio?.walletAssets || !poolsList) {
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
          scrollToTop={scrollToTop}
          toggleScrollToTop={() => setScrollToTop(false)}
        >
          <TokensSelect
            handleTokenSelect={handleTokenSelect}
            selectMode="to"
            tokensList={
              searchTo && searchPools?.length
                ? (searchPools as PoolGeckoType[])
                : (poolsList as PoolGeckoType[])
            }
            searchTo={searchTo}
            handleChangeSearchTo={(query) => {
              if (!query && searchTo) {
                setScrollToTop(true);
              }
              if (query && !searchTo) {
                setScrollToTop(true);
              }
              setSearchTo(query);
            }}
            isLoading={isFetchingSearchPools}
          />
          {isFetchingNextPage && (
            <Flex
              className="sticky-spinner"
              align="center"
              justify="center"
              pb="5"
            >
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
