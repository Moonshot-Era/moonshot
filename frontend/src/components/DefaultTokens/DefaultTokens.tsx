import { Flex, Spinner } from '@radix-ui/themes';

import { TokenCard } from '@/legos';
import { isSolanaAddress } from '@/helpers/helpers';
import { useDefaultTokens } from '@/hooks/useDefaultTokens';
import { OverviewTokenSelectedType } from '@/services/helius/getWalletPortfolio';

import { TokenItemGeckoType } from '@/@types/gecko';
import { SkeletonExploreList } from '../Skeleton/components/SkeletonExplore/SkeletonExploreList';

export const DefaultTokens = ({
  handleTokenSelect
}: {
  handleTokenSelect: (token: OverviewTokenSelectedType) => void;
}) => {
  const { defaultTokens, isFetching: isDefaultTokensFetching } =
    useDefaultTokens();
  return (
    <Flex pr={isDefaultTokensFetching ? '0' : '3'} gap="4" direction="column">
      {isDefaultTokensFetching ? (
        <SkeletonExploreList cardLength={2} />
      ) : (
        (defaultTokens as TokenItemGeckoType[])?.map(
          (token: TokenItemGeckoType) => {
            return (
              <TokenCard
                key={`${token?.attributes?.address || token?.id}`}
                token={token}
                onClick={() =>
                  handleTokenSelect({
                    name: isSolanaAddress(token?.attributes?.address)
                      ? 'SOL'
                      : token?.attributes?.name || '',
                    uiAmount: 0,
                    decimals: token?.attributes?.decimals || 0,
                    address: token?.attributes?.address || '',
                    symbol: token?.attributes?.symbol || ''
                  } as OverviewTokenSelectedType)
                }
                isDefaultToken
              />
            );
          }
        )
      )}
      <div
        style={{
          width: `calc(100% - ${isDefaultTokensFetching ? '12px' : '0px'})`,
          height: '1px',
          backgroundColor: 'gray',
          marginBottom: 16
        }}
      />
    </Flex>
  );
};
