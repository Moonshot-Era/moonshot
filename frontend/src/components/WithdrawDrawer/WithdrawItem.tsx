'use client';

import { Flex, Text } from '@radix-ui/themes';

import './style.scss';
import { Icon, Input, SlideButton } from '@/legos';
import { WalletPortfolioAssetType } from '@/services/birdeye/getWalletPortfolio';
import { ChangeEvent, useState } from 'react';
import { formatNumber } from '@/helpers/helpers';

interface WithdrawItemProps {
  asset?: WalletPortfolioAssetType;
  onSlideHandler(): void;
  onAssetChange(): void;
}

export const WithdrawItem = ({
  asset,
  onSlideHandler,
  onAssetChange,
}: WithdrawItemProps) => {
  const [transactionAmount, setTransactionAmount] = useState(asset?.uiAmount);
  const [amountError, setAmountError] = useState('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTransactionAmount(+formatNumber.format(+event.target.value));
    if (asset?.uiAmount && +event.target.value > +asset?.uiAmount) {
      setAmountError('Please porvide correct value');
    } else if (amountError) {
      setAmountError('');
    }
  };

  return (
    <Flex width="100%" direction="column" align="center" px="4" pb="6" gap="6">
      <Text size="4" weight="bold">
        {`Withdraw ${asset?.name}`}
      </Text>
      <Flex width="100%" justify="center" align="center" gap="3" height="80px">
        <Flex direction="column" align="center" px="3" style={{ opacity: 0 }}>
          <Icon icon="switchHorizontal" />
          <Text size="4" weight="medium">
            {asset?.name}
          </Text>
        </Flex>
        <Flex>
          <Text size="7" weight="medium">
            <Input
              className="withdraw-input"
              value={transactionAmount}
              error={!!amountError}
              errorText={amountError}
              errorClassName="withdraw-input-error"
              onChange={handleChange}
              type="number"
              lang="en-US"
            />
          </Text>
        </Flex>
        <Flex direction="column" align="center" px="3" onClick={onAssetChange}>
          <Icon icon="switchHorizontal" />
          <Text size="4" weight="medium">
            {asset?.name}
          </Text>
        </Flex>
      </Flex>

      {/* <Box width="100%" py="2" pl="2" pr="4" className="withdraw-info-card">
      <Text size="1" weight="medium">
        You need at least 1,000 MICHI to complete a withdrawal
      </Text>
    </Box> */}
      <Input placeholder="Wallet address" />
      <SlideButton disabled={!!amountError} />
    </Flex>
  );
};
