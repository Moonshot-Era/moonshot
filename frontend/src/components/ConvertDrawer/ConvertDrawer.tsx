'use client';

// TODO:
// 1) price of tokens in tokensList
// 2) Show available tokens to convert
// 3) Add input of tokens to convert with validation???
// 4) Add max btn for tokens to convert
// 5) Find routes for convert in jupiter
// 6) Convert
// 7) Infinite scroll

import { FC, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import './style.scss';
import { SheetDrawer } from '@/legos';
import { TokensSelect } from './TokensSelect';
import { ConvertForm } from './ConvertForm';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Props {
  isOpen: boolean;
  toggleOpen: () => void;
}

type Portfolio = {}

const fetchPortfolip = (): Promise<Portfolio[]> => axios.post(
  `${process.env.NEXT_PUBLIC_SITE_URL}/api/birdeye/wallet-portfolio`,
  { walletAddress: '' }
).then((response) => response.data.walletPortfolio)

const fetchTokensList = (): Promise<Portfolio[]> => axios.post(
  `${process.env.NEXT_PUBLIC_SITE_URL}/api/birdeye/token-list`,
  { offset: 0, limit: 50 }
).then((response) => response.data.tokenList.data.tokens)


const usePortfolio = () => {
  const { data, ...rest } = useQuery({
    queryKey: ['portfolio'],
    queryFn: fetchPortfolip,
  })

  return { portfolio: data, ...rest }
};

const useTokensList = () => {
  const { data, ...rest } = useQuery({
    queryKey: ['tokensList'],
    queryFn: fetchTokensList,
  })

  return {
    tokensList: data,
    ...rest,
  };
};

const DEFAULT_TOKENS = {
  from: null,
  to: null,
}

export const ConvertDrawer: FC<Props> = forwardRef(function ConvertDrawer({}, ref) {
  const [state, setState] = useState<string|null>(null);
  const { portfolio } = usePortfolio();
  const { tokensList } = useTokensList();
  const [selectedTokens, setSelectedTokens] = useState(DEFAULT_TOKENS)

  const handleTokenSelect = (token) => {
    setSelectedTokens({
      ...selectedTokens,
      [state]: token,
    })

    if (state === 'from' && !selectedTokens.to) {
      setState('to')
    } else {
      setState('convert')
    }
  }

  const handleClose = () => {
    setState(null)
    setSelectedTokens(DEFAULT_TOKENS)
  };

  useImperativeHandle(ref, () => {
    return {
      open: () => setState('from'),
      close: () => setState(null),
    };
  }, []);

  console.log('portfolio', portfolio)

  return (
    <>
      <SheetDrawer
        isOpen={state === 'from'}
        handleClose={handleClose}
        snapPoints={[window?.innerHeight, 450]}
        initialSnap={1}
      >
        <TokensSelect handleTokenSelect={handleTokenSelect} selectMode="from" tokensList={portfolio?.items} />
      </SheetDrawer>
      <SheetDrawer
        isOpen={state === 'to'}
        handleClose={handleClose}
        snapPoints={[window?.innerHeight, 450]}
        initialSnap={1}
      >
        <TokensSelect handleTokenSelect={handleTokenSelect} selectMode="to" tokensList={tokensList} />
      </SheetDrawer>
      <SheetDrawer
        isOpen={state === 'convert'}
        detent="content-height"
        handleClose={handleClose}
      >
        <ConvertForm selectedTokens={selectedTokens} />
      </SheetDrawer>
    </>
  );
});
