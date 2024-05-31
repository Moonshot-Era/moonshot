'use client';

import { ChangeEvent, FC, useCallback, useEffect, useState } from 'react';
import { Flex, Text } from '@radix-ui/themes';
import debounce from 'lodash.debounce';

import './style.scss';
import { PoolGeckoType } from '@/@types/gecko';
import { AssetCard, Input, TokenCard } from '@/legos';
import { WalletPortfolioAssetType } from '@/services/birdeye/getWalletPortfolio';

interface Props {
  tokensList: WalletPortfolioAssetType[] | PoolGeckoType[];
  handleTokenSelect: (token: WalletPortfolioAssetType | PoolGeckoType) => void;
  selectMode: 'to' | 'from';
  searchTo?: string;
  handleChangeSearchTo?: (query: string) => void;
}

export const TokensSelect: FC<Props> = ({
  tokensList,
  handleTokenSelect,
  selectMode,
  searchTo,
  handleChangeSearchTo
}) => {
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
        <Text size="4" weight="bold" align="center" mb="2">
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
      </Flex>
      <Flex width="100%" direction="column" gap="4" px="4">
        {selectMode === 'from'
          ? searchFrom && filteredPools?.length
            ? filteredPools?.map((token) => {
                return (
                  <AssetCard
                    key={token?.address}
                    asset={token}
                    onClick={() => handleTokenSelect(token)}
                  />
                );
              })
            : (tokensList as WalletPortfolioAssetType[])?.map(
                (token: WalletPortfolioAssetType) => {
                  return (
                    <AssetCard
                      key={token?.address}
                      asset={token}
                      onClick={() => handleTokenSelect(token)}
                    />
                  );
                }
              )
          : null}
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
