'use client';

import axios from 'axios';
import { ChangeEvent, useRef, useState } from 'react';
import { Flex, Text } from '@radix-ui/themes';

import './style.scss';
import { useWidth } from '@/hooks/useWidth';
import { Icon, Input, SlideButton } from '@/legos';
import { formatNumberToUsd } from '@/helpers/helpers';
import { WalletPortfolioAssetType } from '@/services/helius/getWalletPortfolio';

interface WithdrawItemProps {
  asset?: WalletPortfolioAssetType;
  onSlideHandler(
    toAddress: string,
    transactionAmount: number | string,
    tokenPrice: number,
    symbol: string
  ): Promise<void>;
}

const TO_ADDRESS_ERROR = 'Invalid Solana address';

export const WithdrawItem = ({ asset, onSlideHandler }: WithdrawItemProps) => {
  const { mdScreen } = useWidth();

  const [toAddress, setToAddress] = useState<string>('');
  const [transactionAmount, setTransactionAmount] = useState<number | string>(
    ''
  );
  const [toAddressError, setToAddressError] = useState('');
  const [amountError, setAmountError] = useState('');
  const [amountInputInUsd, setAmountInputInUsd] = useState(true);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const btnRef = useRef({});

  const assetName = asset?.name.split('/')[0];
  const AMOUNT_ERR = `Insufficient ${amountInputInUsd ? assetName : 'USD'}`;
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

  const handleChangeToAddress = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setToAddress(event.target.value);
    if (toAddressError) {
      setToAddressError('');
    }
  };

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

  const handleSubmitWithdrawal = async () => {
    setWithdrawLoading(true);
    try {
      const { data: isSolanaWallet } = await axios.post(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/validate-wallet`,
        {
          wallet: toAddress
        }
      );
      if (!isSolanaWallet) {
        // @ts-ignore
        btnRef.current?.resetSlide();
        setToAddressError(TO_ADDRESS_ERROR);
        return;
      }
      if (toAddress && transactionAmount) {
        const amount = amountInputInUsd
          ? (+(transactionAmount || 0) / (asset?.priceUsd || 0)).toFixed(
              transactionAmount && +transactionAmount ? decimalLength : 0
            )
          : transactionAmount;
        await onSlideHandler(
          toAddress,
          amount,
          asset?.priceUsd || 0,
          asset?.symbol || ''
        );
      }
    } catch (err) {
      // @ts-ignore
      btnRef.current?.resetSlide();
    } finally {
      setWithdrawLoading(false);
    }
  };

  return (
    <Flex width="100%" direction="column" align="center" px="4" pb="6" gap="6">
      <Text size={mdScreen ? '5' : '4'} weight="bold">
        {`Withdraw ${assetName}`}
      </Text>
      <Flex
        width="100%"
        maxWidth="100%"
        justify="center"
        align="center"
        gap="24px"
        direction="column"
        wrap="wrap"
      >
        <Flex direction="column" align="center" style={{ display: 'none' }}>
          <Icon icon="switchHorizontal" />
          <Text size={mdScreen ? '5' : '4'} weight="medium">
            {assetName}
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
              textOverflow: 'ellipsis'
            }}
          >
            {amountInputInUsd
              ? (+(transactionAmount || 0) / (asset?.priceUsd || 0)).toFixed(
                  transactionAmount && +transactionAmount ? decimalLength : 0
                )
              : formatNumberToUsd().format(
                  +(transactionAmount || 0) * (asset?.priceUsd || 0)
                )}
          </Text>
          {amountInputInUsd && (
            <Text size={mdScreen ? '5' : '4'}>{assetName}</Text>
          )}
        </Flex>
        <Flex direction="column" align="center" onClick={handleChangeCurrency}>
          <Icon icon="switchHorizontal" />
          <Text size={mdScreen ? '5' : '4'} weight="medium">
            {amountInputInUsd ? 'USD' : assetName}
          </Text>
        </Flex>
      </Flex>

      {/* <Box width="100%" py="2" pl="2" pr="4" className="withdraw-info-card">
      <Text size={mdScreen ? '3' : '1'} weight="medium">
        You need at least 1,000 MICHI to complete a withdrawal
      </Text>
    </Box> */}
      <Input
        placeholder="Wallet address"
        value={toAddress}
        error={!!toAddressError}
        errorText={toAddressError}
        onChange={handleChangeToAddress}
      />
      <Flex width="100%" direction="column" gap="1">
        <Input
          placeholder="Amount"
          value={transactionAmount}
          error={!!amountError}
          errorText={amountError}
          onChange={handleChangeAmount}
          type={'number'}
          endAdornment={<Text>{amountInputInUsd ? 'USD' : assetName}</Text>}
        />
        <Flex justify={!!amountError ? 'end' : 'between'}>
          {!amountError && (
            <Text size={mdScreen ? '3' : '2'}>
              Available {asset?.uiAmount} {assetName}
            </Text>
          )}
          <Text
            size={mdScreen ? '3' : '1'}
            className="transfer-card-max"
            onClick={handleSetMax}
          >
            Max
          </Text>
        </Flex>
      </Flex>
      <SlideButton
        ref={btnRef}
        disabled={
          !!amountError ||
          !!toAddressError ||
          !transactionAmount ||
          !toAddress ||
          withdrawLoading
        }
        handleSubmit={handleSubmitWithdrawal}
        loading={withdrawLoading}
      />
    </Flex>
  );
};
