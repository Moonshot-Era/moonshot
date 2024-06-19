'use client';

import { ChangeEvent, FC, useCallback, useEffect, useState } from 'react';
import { Flex, Spinner, Text } from '@radix-ui/themes';
import debounce from 'lodash.debounce';

import './style.scss';
import { useWidth } from '@/hooks/useWidth';
import { PoolGeckoType } from '@/@types/gecko';
import { AssetCard, Input, TokenCard } from '@/legos';
import { WalletPortfolioAssetType } from '@/services/helius/getWalletPortfolio';
import { isSolanaAddress } from '@/helpers/helpers';
import { USDC_ADDRESS } from '@/utils';

interface Props {
  tokensList: WalletPortfolioAssetType[] | PoolGeckoType[];
  handleTokenSelect: (token: WalletPortfolioAssetType | PoolGeckoType) => void;
  selectMode: 'to' | 'from';
  searchTo?: string;
  handleChangeSearchTo?: (query: string) => void;
  isLoading?: boolean;
}

export const TokensSelect: FC<Props> = ({
  tokensList,
  handleTokenSelect,
  selectMode,
  searchTo,
  handleChangeSearchTo,
  isLoading
}) => {
  const { mdScreen } = useWidth();

  const [searchFrom, setSearchFrom] = useState('');
  const [filteredPools, setFilteredPools] = useState<
    WalletPortfolioAssetType[]
  >([]);

  const debouncedSearchPools = useCallback(
    debounce(async (searchQuery) => {
      setFilteredPools(
        (tokensList as WalletPortfolioAssetType[])?.filter(
          (item: WalletPortfolioAssetType) =>
            item?.name
              ?.trim()
              ?.toLowerCase()
              ?.includes(searchQuery?.trim()?.toLowerCase()) ||
            item?.address
              ?.trim()
              ?.toLowerCase()
              ?.includes(searchQuery?.trim()?.toLowerCase())
        )
      );
    }, 300),
    []
  );

  useEffect(() => {
    if (searchFrom) {
      debouncedSearchPools(searchFrom);
    }
  }, [debouncedSearchPools, searchFrom]);

  const handleChangeSearchFrom = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchFrom(event.target.value);
  };

  const sortByDefault =
    selectMode === 'from'
      ? (tokensList as WalletPortfolioAssetType[])?.reduce(
          (acc, cur) => {
            if (isSolanaAddress(cur.address) || cur.address === USDC_ADDRESS) {
              acc.defaultTokens.push(cur);
            } else {
              acc.restTokens.push(cur);
            }
            return acc;
          },
          {
            defaultTokens: [] as WalletPortfolioAssetType[],
            restTokens: [] as WalletPortfolioAssetType[]
          }
        )
      : undefined;

  return (
    <Flex
      width="100%"
      direction="column"
      align="center"
      gap="4"
      pb="6"
      position="relative"
    >
      <Flex className="search-input-holder" pb="2" px="4" direction="column">
        <Text size={mdScreen ? '5' : '4'} weight="bold" align="center" mb="2">
          Convert {selectMode === 'to' ? 'to' : 'from'}
        </Text>
        <Input
          placeholder="Search assets"
          icon="search"
          type="search"
          onChange={(e) => {
            if (selectMode === 'from') {
              handleChangeSearchFrom(e);
            } else if (handleChangeSearchTo) {
              handleChangeSearchTo(e.target.value);
            }
          }}
          value={selectMode === 'from' ? searchFrom : searchTo}
        />
        {isLoading && (
          <Flex
            className="sticky-spinner"
            align="center"
            justify="center"
            pt="4"
          >
            <Spinner size="3" />
          </Flex>
        )}
      </Flex>
      <Flex width="100%" direction="column" gap="4" px="4">
        {selectMode === 'from' ? (
          searchFrom && filteredPools?.length ? (
            filteredPools?.map((token) => {
              return (
                <AssetCard
                  key={token?.address}
                  asset={token}
                  onClick={() => handleTokenSelect(token)}
                />
              );
            })
          ) : (
            <>
              {sortByDefault?.defaultTokens?.map(
                (asset: WalletPortfolioAssetType) => (
                  <AssetCard
                    key={asset.address}
                    asset={asset}
                    onClick={() => handleTokenSelect(asset)}
                  />
                )
              )}
              <div
                style={{
                  width: '100%',
                  height: '1px',
                  backgroundColor: 'gray'
                }}
              />
              {sortByDefault?.restTokens?.map(
                (asset: WalletPortfolioAssetType) => (
                  <AssetCard
                    key={asset.address}
                    asset={asset}
                    onClick={() => handleTokenSelect(asset)}
                  />
                )
              )}
            </>
          )
        ) : null}
        {selectMode === 'to'
          ? (tokensList as PoolGeckoType[])?.map((token: PoolGeckoType) => {
              return (
                <TokenCard
                  key={`${token?.attributes?.address || token?.id}`}
                  token={token}
                  onClick={() => handleTokenSelect(token)}
                />
              );
            })
          : null}
      </Flex>
    </Flex>
  );
};
