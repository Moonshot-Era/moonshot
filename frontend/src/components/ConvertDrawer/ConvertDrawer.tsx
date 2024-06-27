'use client';

import { FC, memo, useState, forwardRef, useImperativeHandle } from 'react';
import './style.scss';
import { SheetDrawer } from '@/legos';
import { TokensSelect } from './TokensSelect';
import { ConvertForm } from './ConvertForm';
import { Text } from '@radix-ui/themes';

import { PoolGeckoType } from '@/@types/gecko';
import { SelectedTokens } from './types';
import {
  OverviewTokenSelectedType,
  WalletPortfolioAssetType,
  WalletPortfolioNormilizedType
} from '@/services/helius/getWalletPortfolio';
import { NormilizedTokenDataOverview } from '@/services/gecko/getTokenOverview';
import { NormilizedTokenInfoOverview } from '@/services/gecko/getTokenInfo';
import { BASE_SOLANA_TOKEN, SOLANA_WRAPPED_ADDRESS } from '@/utils';
import { ExploreContent } from '../ExploreContent/ExploreContent';
import { useWidth } from '@/hooks/useWidth';

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
    const { mdScreen } = useWidth();

    const [selectedTokens, setSelectedTokens] =
      useState<SelectedTokens>(DEFAULT_TOKENS);

    const handleTokenSelect = (
      token:
        | WalletPortfolioAssetType
        | PoolGeckoType
        | OverviewTokenSelectedType
    ) => {
      setSelectedTokens({
        ...selectedTokens,
        [`${state}`]: token
      });
      setState('convert');
    };

    const handleClose = () => {
      setState(null);
      setSelectedTokens(DEFAULT_TOKENS);
    };

    useImperativeHandle(
      ref,
      () => {
        return {
          open: (
            tokenPrefill: NormilizedTokenDataOverview &
              NormilizedTokenInfoOverview
          ) => {
            if (tokenPrefill) {
              setSelectedTokens({
                // @ts-ignore
                from:
                  (portfolio?.walletAssets as WalletPortfolioAssetType[])?.find(
                    ({ address }) => address === SOLANA_WRAPPED_ADDRESS
                  ) || BASE_SOLANA_TOKEN,
                ...(tokenPrefill.address !== SOLANA_WRAPPED_ADDRESS && {
                  to: {
                    tokenOverview: {
                      // @ts-ignore
                      attributes: {
                        decimals: tokenPrefill.decimals as number
                      }
                    },
                    included: {
                      // @ts-ignore
                      attributes: {
                        name: tokenPrefill.name,
                        address: tokenPrefill.address
                      }
                    }
                  }
                })
              });
            }
            setState('convert');
          },
          close: () => setState(null)
        };
      },
      [portfolio]
    );

    const swapSelectedTokensPlaces = () => {
      setSelectedTokens({
        // @ts-ignore
        from:
          selectedTokens?.to && !selectedTokens?.to?.uiAmount
            ? portfolio?.walletAssets?.find(
                (asset) =>
                  asset.address ===
                  selectedTokens.to?.included?.attributes.address
              )
            : selectedTokens.to,
        to: selectedTokens.from
      });
    };

    return (
      <>
        <SheetDrawer
          isOpen={state === 'from'}
          handleClose={handleClose}
          snapPoints={[800, 450]}
          initialSnap={1}
          withScroller
        >
          <TokensSelect
            handleTokenSelect={handleTokenSelect}
            tokensList={portfolio?.walletAssets as WalletPortfolioAssetType[]}
          />
        </SheetDrawer>
        <SheetDrawer
          isOpen={state === 'to'}
          handleClose={handleClose}
          snapPoints={[800, 450]}
          initialSnap={2}
          withScroller={false}
        >
          <Text
            size={mdScreen ? '5' : '4'}
            weight="bold"
            align="center"
            style={{ display: 'block' }}
          >
            Convert to
          </Text>
          <ExploreContent showDefault onTokenClick={handleTokenSelect} />
        </SheetDrawer>
        <SheetDrawer
          isOpen={state === 'convert'}
          detent="content-height"
          handleClose={handleClose}
          withScroller
        >
          <ConvertForm
            selectedTokens={selectedTokens}
            changeSelected={(reselect) => setState(reselect)}
            closeDrawer={handleClose}
            walletAddress={portfolio?.wallet}
            swapSelectedTokensPlaces={swapSelectedTokensPlaces}
          />
        </SheetDrawer>
      </>
    );
  })
);
