import { forwardRef, useEffect, useState } from "react";
import { Box, Flex, Text } from "@radix-ui/themes";
import axios from "axios";
import { Button, SlideButton } from "@/legos";
import { useQuery } from "@tanstack/react-query";
import { SelectedTokens } from '../ConvertDrawer/types';
import {
  WalletPortfolioAssetType,
  WalletPortfolioNormilizedType,
} from '@/services/birdeye/getWalletPortfolio';
import { TokenItemBirdEyeType } from '@/@types/birdeye';

const fetchPortfolip = (): Promise<WalletPortfolioNormilizedType> =>
  axios
    .post(`${process.env.NEXT_PUBLIC_SITE_URL}/api/birdeye/wallet-portfolio`, {
      walletAddress: '',
    })
    .then((response) => response.data.walletPortfolio);

const usePortfolio = () => {
  const resp = useQuery({
    queryKey: ['portfolio'],
    queryFn: fetchPortfolip,
  });

  return resp;
};

const useTokensList = () => {
  const [tokensList, setTokensList] = useState();

  useEffect(() => {
    if (!tokensList) {
      (async () => {
        const {
          data: { tokenList },
        } = await axios.post(
          `${process.env.NEXT_PUBLIC_SITE_URL}/api/birdeye/token-list`,
          { offset: 0, limit: 50 }
        );

        setTokensList(tokenList.data.tokens);
      })();
    }
  }, []);

  return {
    tokensList: tokensList || [],
  };
};

export const TokensPick = ({
  selectedTokens,
  setSelectedTokens,
}: {
  selectedTokens: SelectedTokens;
  setSelectedTokens(val: SelectedTokens): void;
}) => {
  const { tokensList } = useTokensList();
  const { data: portfolio } = usePortfolio();
  const [showSelect, setShowSelect] = useState<string | boolean>(false);

  const handleTokenPick = (
    token: WalletPortfolioAssetType | TokenItemBirdEyeType
  ) => {
    setSelectedTokens({
      ...selectedTokens,
      [`${showSelect}`]: token,
    });
    setShowSelect(false);
  };

  return (
    <Flex
      gap="4"
      direction="column"
      justify="center"
      align="center"
      width="100%"
    >
      {showSelect ? (
        <>
          <Text>Pick {showSelect}</Text>
          {(showSelect === 'from' && portfolio?.walletAssets
            ? portfolio?.walletAssets
            : tokensList
          ).map((token) => (
            <Box onClick={() => handleTokenPick(token)} key={token.symbol}>
              <Text>{token.symbol}</Text>
            </Box>
          ))}
        </>
      ) : (
        <Flex width="100%" direction="column">
          <Flex width="100%">
            <Flex direction="column" width="100%">
              <Text>65,000</Text>
              {selectedTokens.from?.balance ? (
                <Text>Available: {selectedTokens.from?.balance}</Text>
              ) : null}
            </Flex>
            <Button onClick={() => setShowSelect('from')}>
              FROM{' '}
              {selectedTokens.from ? `(${selectedTokens.from.symbol})` : ''}
            </Button>
          </Flex>
          <Flex width="100%">
            <Text>65,000</Text>
            <Button onClick={() => setShowSelect('to')}>
              TO {selectedTokens.to ? `(${selectedTokens.to.symbol})` : ''}
            </Button>
          </Flex>
        </Flex>
      )}

      <SlideButton handleSubmit={() => {}} />
    </Flex>
  );
};
