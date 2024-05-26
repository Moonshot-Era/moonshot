'use client';

import { FC } from 'react';
import { Box, Flex, Text } from '@radix-ui/themes';

import './style.scss';
import { AssetCard, Icon, Input, TokenCard } from '@/legos';
import { WalletPortfolioAssetType } from '@/services/birdeye/getWalletPortfolio';

interface Props {
  toggleTransfer: (token: WalletPortfolioAssetType) => void;
  handleClose(): void;
}

const mockAsset: WalletPortfolioAssetType = {
  address: 'HTnKf3f3vtLaGVVtYkZ8oCTyWEA64n5a1P4Dkkk5vjmH',
  name: 'SOL',
  symbol: 'SOL',
  decimals: 2,
  priceUsd: 222,
  imageUrl: '',
  percentage_change_h24: 0.9,
  balance: 5,
  uiAmount: 250,
  valueUsd: 23,
};

export const DepositList: FC<Props> = ({ toggleTransfer, handleClose }) => {
  const formConfiguration = {
    apiKey: 'pk_fad9eca9a5a5dba43bf2294041f58526',
  };
  const handleShowShift4Form =
    // @ts-ignore
    Shift4CryptoSDK.createForm(formConfiguration).append();

  const handleDepositWithShift4 = () => {
    handleClose();
    handleShowShift4Form.show();
  };
  return (
    <Flex width="100%" direction="column" align="center" gap="4" px="4" pb="6">
      <Text size="4" weight="bold">
        Deposit
      </Text>
      <Flex
        width="100%"
        direction="row"
        py="4"
        px="3"
        gap="4"
        className="deposit-transfer-card-bank"
      >
        <Icon icon="shift4" />
        <Flex
          direction="column"
          justify="between"
          onClick={handleDepositWithShift4}
        >
          <Text size="3" weight="medium">
            Shift4
          </Text>
          <Text>Card or bank transfer</Text>
        </Flex>
      </Flex>
      <Box width="100%" className="deposit-transfer-card-bank-border" />
      <Input placeholder="Search assets" icon="search" />
      <Flex width="100%" direction="column" gap="4">
        <AssetCard
          key={mockAsset.address}
          asset={mockAsset}
          handler={() => toggleTransfer(mockAsset)}
        />
        {Array(3)
          .fill(3)
          .map((item, index) => (
            <TokenCard key={index} handler={() => {}} />
          ))}
      </Flex>
    </Flex>
  );
};
