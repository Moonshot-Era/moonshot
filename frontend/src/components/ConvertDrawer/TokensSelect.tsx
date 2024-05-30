'use client';

import { ChangeEvent, FC, useCallback, useEffect, useState } from 'react';
import { Flex, Text } from '@radix-ui/themes';
import { AssetCard, Input, TokenCard } from '@/legos';

import './style.scss';
import { PoolGeckoType } from '@/@types/gecko';
import { WalletPortfolioAssetType } from '@/services/birdeye/getWalletPortfolio';
import { TokenItemBirdEyeType } from '@/@types/birdeye';
import { useSearchPools } from '@/hooks/useSearchPools';
import debounce from 'lodash.debounce';
import { set } from 'lodash';

interface Props {
  tokensList: WalletPortfolioAssetType[] | PoolGeckoType[];
  handleTokenSelect: (token: WalletPortfolioAssetType | PoolGeckoType) => void;
  selectMode: 'to' | 'from';
}

export const TokensSelect: FC<Props> = ({
  tokensList,
  handleTokenSelect,
  selectMode
}) => {
  const [search, setSearch] = useState('');
  const [filteredPools, setFilteredPools] = useState<
    WalletPortfolioAssetType[]
  >([]);

  const { searchPools, refetch, isFetching } = useSearchPools(search);

  const debouncedSearchPools = useCallback(
    debounce(async (searchQuery) => {
      if (selectMode === 'to') {
        await refetch(searchQuery);
      } else {
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
      }
    }, 300),
    []
  );

  useEffect(() => {
    if (search) {
      debouncedSearchPools(search);
    }
  }, [debouncedSearchPools, search]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
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
          onChange={handleSearchChange}
          value={search}
        />
      </Flex>
      <Flex width="100%" direction="column" gap="4" px="4">
        {selectMode === 'from'
          ? search && filteredPools?.length
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
          ? search && searchPools?.length
            ? (searchPools as PoolGeckoType[])?.map((token: PoolGeckoType) => {
                return (
                  <TokenCard
                    key={`search-${token?.id}`}
                    token={token}
                    onClick={() => handleTokenSelect(token)}
                  />
                );
              })
            : (tokensList as PoolGeckoType[])?.map((token: PoolGeckoType) => {
                return (
                  <TokenCard
                    key={token?.id}
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
