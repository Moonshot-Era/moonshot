'use client';

import { Flex, Text } from '@radix-ui/themes';

import './style.scss';
import { Icon, Input, SlideButton } from '@/legos';
import { WalletPortfolioAssetType } from '@/services/birdeye/getWalletPortfolio';
import { ChangeEvent, useState } from 'react';
import { formatNumberToUsd } from '@/helpers/helpers';

interface WithdrawItemProps {
  asset?: WalletPortfolioAssetType;
  onSlideHandler(): void;
}

const TO_ADDRESS_ERROR = 'Invalid Solana address';
const AMOUNT_ERR = 'Please porvide correct value';

export const WithdrawItem = ({ asset, onSlideHandler }: WithdrawItemProps) => {
  const [toAddress, setToAddress] = useState<string | undefined>();
  const [transactionAmount, setTransactionAmount] = useState<
    number | string | undefined
  >();
  const [toAddressError, setToAddressError] = useState('');
  const [amountError, setAmountError] = useState('');
  const [amountInputInUsd, setAmountInputInUsd] = useState(true);

  const decimalLength = `${asset?.uiAmount}`.split('.')?.[1]?.length || 0;

  const handleChangeCurrency = () => {
    setAmountInputInUsd(!amountInputInUsd);
    if (!amountInputInUsd) {
      if (asset?.valueUsd && +(transactionAmount || 0) > +asset?.valueUsd) {
        setAmountError(AMOUNT_ERR);
      } else if (amountError) {
        setAmountError('');
      }
    } else {
      if (asset?.uiAmount && +(transactionAmount || 0) > +asset?.uiAmount) {
        setAmountError(AMOUNT_ERR);
      } else if (amountError) {
        setAmountError('');
      }
    }
  };

  const handleChangeToAddress = async () => {};

  const handleChangeAmount = (event: ChangeEvent<HTMLInputElement>) => {
    if (amountInputInUsd && event.target.value) {
      setTransactionAmount(event.target.value);
      if (asset?.valueUsd && +event.target.value > +asset?.valueUsd) {
        setAmountError(AMOUNT_ERR);
      } else if (amountError) {
        setAmountError('');
      }
    } else if (event.target.value || event.target.value === '') {
      setTransactionAmount(event.target.value);
      if (asset?.uiAmount && +event.target.value > +asset?.uiAmount) {
        setAmountError(AMOUNT_ERR);
      } else if (amountError) {
        setAmountError('');
      }
    }
  };

  const handleSetMax = () => {
    if (amountInputInUsd) {
      setTransactionAmount(asset?.valueUsd.toFixed(2) || 0);
    } else {
      setTransactionAmount(asset?.uiAmount || 0);
    }
    if (amountError) {
      setAmountError('');
    }
  };

  return (
    <Flex width="100%" direction="column" align="center" px="4" pb="6" gap="6">
      <Text size="4" weight="bold">
        {`Withdraw ${asset?.name}`}
      </Text>
      <Flex
        width="100%"
        maxWidth="100%"
        justify="center"
        align="center"
        gap="2"
        direction="row"
        wrap="wrap"
      >
        <Flex direction="column" align="center" style={{ opacity: 0 }}>
          <Icon icon="switchHorizontal" />
          <Text size="4" weight="medium">
            {asset?.name}
          </Text>
        </Flex>
        <Flex flexGrow="1" maxWidth="100%" justify="center" align="end">
          <Text
            size="7"
            weight="medium"
            style={{
              lineHeight: '46px',
              maxWidth: '100%',
              overflow: 'hidden',
              textWrap: 'nowrap',
              textOverflow: 'ellipsis',
            }}
          >
            {amountInputInUsd
              ? (+(transactionAmount || 0) / (asset?.priceUsd || 0)).toFixed(
                  transactionAmount && +transactionAmount ? decimalLength : 0
                )
              : formatNumberToUsd.format(
                  +(transactionAmount || 0) * (asset?.priceUsd || 0)
                )}
          </Text>
          {amountInputInUsd && <Text size="4">{asset?.name}</Text>}
        </Flex>
        <Flex direction="column" align="center" onClick={handleChangeCurrency}>
          <Icon icon="switchHorizontal" />
          <Text size="4" weight="medium">
            {amountInputInUsd ? 'USD' : asset?.name}
          </Text>
        </Flex>
      </Flex>

      {/* <Box width="100%" py="2" pl="2" pr="4" className="withdraw-info-card">
      <Text size="1" weight="medium">
        You need at least 1,000 MICHI to complete a withdrawal
      </Text>
    </Box> */}
      <Input
        placeholder="Wallet address"
        value={toAddress}
        error={!!amountError}
        onChange={handleChangeToAddress}
      />
      <Flex width="100%" direction="column" gap="1">
        <Input
          placeholder="Amount"
          value={transactionAmount}
          error={!!amountError}
          onChange={handleChangeAmount}
          type={'number'}
          endAdornment={<Text>{amountInputInUsd ? 'USD' : asset?.name}</Text>}
        />
        <Flex justify="between">
          <Text size="2">
            Available {asset?.uiAmount} {asset?.name}
          </Text>
          <Text size="1" className="transfer-card-max" onClick={handleSetMax}>
            Max
          </Text>
        </Flex>
      </Flex>
      <SlideButton
        disabled={!!amountError || !transactionAmount || !toAddress}
      />
    </Flex>
  );
};
