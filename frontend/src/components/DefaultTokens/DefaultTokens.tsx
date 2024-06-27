import { Flex, Spinner } from '@radix-ui/themes';

import { TokenCard } from '@/legos';
import { isSolanaAddress } from '@/helpers/helpers';
import { useDefaultTokens } from '@/hooks/useDefaultTokens';
import { OverviewTokenSelectedType } from '@/services/helius/getWalletPortfolio';

import { TokenItemGeckoType } from '@/@types/gecko';

export const DefaultTokens = ({
  handleTokenSelect
}: {
  handleTokenSelect: (token: OverviewTokenSelectedType) => void;
}) => {
  const { defaultTokens, isFetching: isDefaultTokensFetching } =
    useDefaultTokens();
  return (
    <Flex pr="4" gap="4" direction="column">
      {isDefaultTokensFetching ? (
        <Spinner size="3" style={{ margin: 'auto' }} />
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
          width: '100%',
          height: '1px',
          backgroundColor: 'gray'
        }}
      />
    </Flex>
  );
};
