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

interface Props {
  isOpen: boolean;
  toggleOpen: () => void;
}

type Portfolio = {};

const fetchPortfolio = (): Promise<Portfolio[]> =>
  axios
    .post(`${process.env.NEXT_PUBLIC_SITE_URL}/api/birdeye/wallet-portfolio`, {
      walletAddress: "",
    })
    .then((response) => response.data.walletPortfolio);

const fetchTokensList = ({ pageParam = 0 }): Promise<Portfolio[]> =>
  axios
    .post(`${process.env.NEXT_PUBLIC_SITE_URL}/api/birdeye/token-list`, {
      offset: pageParam,
      limit: 50,
    })
    .then((response) => response.data.tokenList.data);

const usePortfolio = () => {
  const { data, ...rest } = useQuery({
    queryKey: ["portfolio"],
    queryFn: fetchPortfolio,
  });

  return { portfolio: data, ...rest };
};

const useTokensList = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, ...rest } =
    useInfiniteQuery({
      queryKey: ["tokensList"],
      queryFn: fetchTokensList,
      getNextPageParam: (lastPage, pages) => {
        if (!lastPage || !pages) {
          return;
        }

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
  forwardRef(function ConvertDrawer({}, ref) {
    const [state, setState] = useState<string | null>(null);
    const { portfolio } = usePortfolio();
    const { tokensList, fetchNextPage, hasNextPage, isFetchingNextPage } =
      useTokensList();
    const [selectedTokens, setSelectedTokens] = useState(DEFAULT_TOKENS);

    const handleTokenSelect = (token) => {
      setSelectedTokens({
        ...selectedTokens,
        [state]: token,
      });

      if (state === "from" && !selectedTokens.to) {
        setState("to");
      } else {
        setState("convert");
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
          open: () => setState("from"),
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

    const handleTokensListScroll = async (event) => {
      const { scrollTop, scrollHeight, clientHeight } = event.target;

      if (scrollHeight - scrollTop <= clientHeight * 1.5) {
        if (hasNextPage) {
          await debouncedFetchNextPage();
        }
      }
    };

    if (!portfolio?.walletAssets || !tokensList) {
      return null;
    }

    return (
      <>
        <SheetDrawer
          isOpen={state === "from"}
          handleClose={handleClose}
          snapPoints={[800, 450]}
          initialSnap={1}
        >
          <TokensSelect
            handleTokenSelect={handleTokenSelect}
            selectMode="from"
            tokensList={portfolio?.walletAssets}
          />
        </SheetDrawer>
        <SheetDrawer
          isOpen={state === "to"}
          handleClose={handleClose}
          snapPoints={[800, 450]}
          initialSnap={1}
          onScroll={handleTokensListScroll}
        >
          <TokensSelect
            handleTokenSelect={handleTokenSelect}
            selectMode="to"
            tokensList={tokensList}
          />
          {isFetchingNextPage && (
            <Flex align="center" justify="center" pb="5">
              <Spinner size="3" />
            </Flex>
          )}
        </SheetDrawer>
        <SheetDrawer
          isOpen={state === "convert"}
          detent="content-height"
          handleClose={handleClose}
        >
          <ConvertForm
            selectedTokens={selectedTokens}
            changeSelected={(reselect) => setState(reselect)}
            closeDrawer={handleClose}
          />
        </SheetDrawer>
      </>
    );
  })
);
