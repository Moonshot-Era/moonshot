'use client';

import { memo, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Box, Flex, Spinner, Text } from '@radix-ui/themes';
import { convertToInteger } from '@/helpers/convertAmountToInt';
import { Select, SlideButton, TokenNumberInput } from '@/legos';

import { SelectedToken, SelectedTokens } from './types';
import { useSwapMutation, useSwapRoutes } from './hooks';
import './style.scss';
import { snackbar } from '@/helpers/snackbar';
import { formatNumberToUsFormat } from '@/helpers/helpers';
import { useLogout } from '@/hooks';
import { ConvertIconArrow } from './ConvertIconArrow';
import { MINIMUM_CONVERT_AMOUNT } from '@/utils';
import { createBrowserClient } from '@/supabase/client';

type ConvertForm = {
  changeSelected: (reselect: string) => void;
  selectedTokens: SelectedTokens;
  closeDrawer: () => void;
  walletAddress: string;
  portfolioSolanaAmount?: number;
  swapSelectedTokensPlaces: () => void;
};

const getTokenData = (token: SelectedToken) =>
  token
    ? {
        name: token?.name || token?.included?.attributes.name || '',
        uiAmount: token?.uiAmount || 0,
        decimals:
          token?.decimals || token?.tokenOverview?.attributes?.decimals || 0,
        address: token?.address || token?.included?.attributes.address || '',
        symbol: token?.symbol || token?.included?.attributes.symbol || '',
        imageUrl: token?.imageUrl || token?.tokenOverview?.attributes?.image_url
      }
    : null;

const normalizeSelectedTokensData = (selectedTokens: SelectedTokens) => {
  return {
    from: getTokenData(selectedTokens?.from),
    to: getTokenData(selectedTokens?.to)
  };
};

export const ConvertForm = memo(
  ({
    selectedTokens,
    changeSelected,
    closeDrawer,
    walletAddress,
    portfolioSolanaAmount,
    swapSelectedTokensPlaces
  }: ConvertForm) => {
    const normalizedSelectedTokens =
      normalizeSelectedTokensData(selectedTokens);
    const [amount, setAmount] = useState<number | string>(
      normalizedSelectedTokens?.from?.uiAmount || 0.1
    );
    const btnRef = useRef<{ resetSlide: () => void }>();
    const [isValidAmount, setIsValidAmount] = useState(true);

    const label =
      normalizedSelectedTokens?.from && normalizedSelectedTokens?.to
        ? `Convert ${normalizedSelectedTokens?.from?.name} to ${normalizedSelectedTokens.to?.name}`
        : 'Convert';

    useEffect(() => {
      const numericAmount = +amount;

      if (normalizedSelectedTokens?.from?.uiAmount) {
        const isValid =
          numericAmount > 0 &&
          numericAmount <= normalizedSelectedTokens?.from?.uiAmount;
        setIsValidAmount(isValid);
      } else {
        setIsValidAmount(true);
      }
    }, [amount, normalizedSelectedTokens?.from?.uiAmount]);

    const mutation = useSwapMutation();
    const { swapRoutes, isLoading: isSwapRoutesLoading } = useSwapRoutes(
      selectedTokens,
      convertToInteger(+amount, normalizedSelectedTokens?.from?.decimals || 0),
      300,
      isValidAmount
    );

    useEffect(() => {
      if (mutation.isError) {
        snackbar('error', 'An error occurred during the swap.');
      }
    }, [mutation.isError]);

    const handleSwapSubmit = () => {
      toast.promise(
        mutation
          .mutateAsync(
            //@ts-ignore
            {
              swapRoutes,
              feeData: {
                fromAddress: walletAddress,
                amount,
                tokenAddress: normalizedSelectedTokens?.from?.address,
                tokenDecimals: normalizedSelectedTokens?.from?.decimals,
                tokenSymbol: normalizedSelectedTokens?.from?.symbol
              }
            }
          )
          .then(async (res) => {
            if (res?.data?.error?.statusText === 'Forbidden') {
              snackbar(
                'error',
                res?.data?.error?.errorMessage ||
                  `Something went wrong, please try again.`
              );
            }
            if (res?.data?.error) {
              const errMessage = res?.data?.error?.includes(
                'Transfer: insufficient lamports'
              )
                ? 'Transfer: insufficient lamports ' +
                  res?.data?.error
                    ?.split('Transfer: insufficient lamports')?.[1]
                    .split('",')?.[0]
                : res?.data?.error;
              snackbar('error', errMessage);
            }
            if (res?.data?.txid) {
              const supabaseClient = createBrowserClient();
              const userId = (await supabaseClient.auth.getUser()).data.user
                ?.id;
              await supabaseClient.from('transactions').insert({
                // @ts-ignore
                created_at: new Date().toISOString(),
                user_id: userId,
                transaction_type: 'convert',
                tx_hash: res?.data?.txid,

                token_address: normalizedSelectedTokens?.from?.address,
                token_name: normalizedSelectedTokens?.from?.name,
                token_symbol: normalizedSelectedTokens?.from?.symbol,
                token_amount: +amount,
                token_image_url: normalizedSelectedTokens?.from?.imageUrl,

                token_output_address: normalizedSelectedTokens?.to?.address,
                token_output_name: normalizedSelectedTokens?.to?.name,
                token_output_symbol: normalizedSelectedTokens?.to?.symbol,
                token_output_amount:
                  (swapRoutes?.outAmount || 0) /
                  10 ** (normalizedSelectedTokens?.to?.decimals || 0),
                token_output_image_url: normalizedSelectedTokens?.to?.imageUrl
              });
              snackbar('success', `Finished converting!`);
              closeDrawer();
            }
          })
          .catch((err) => {
            snackbar(
              'error',
              err?.message || 'Something went wrong, please try again.'
            );
            btnRef.current?.resetSlide();
          })
          .finally(() => btnRef.current?.resetSlide()),
        {
          loading: `Converting ${amount} ${
            normalizedSelectedTokens?.from?.name
          } into ${formatNumberToUsFormat(
            normalizedSelectedTokens?.to?.decimals
          ).format(
            (swapRoutes?.outAmount || 0) /
              10 ** (normalizedSelectedTokens?.to?.decimals || 0)
          )} ${normalizedSelectedTokens?.to?.name}`,
          dismissible: true,
          className: 'snackbar-promise',
          position: 'top-center'
        }
      );
    };
    const minimumNotMet = !!(
      portfolioSolanaAmount && portfolioSolanaAmount < MINIMUM_CONVERT_AMOUNT
    );

    return (
      <Flex
        width="100%"
        direction="column"
        align="center"
        px="4"
        pb="6"
        gap="5"
      >
        <Text size="4" weight="bold">
          {label}
        </Text>
        {minimumNotMet && (
          <Box width="100%" py="3" px="2" className="message-card">
            <Text size="1" weight="medium">
              {`You need at least ${MINIMUM_CONVERT_AMOUNT} SOL to cover network fees.`}
            </Text>
          </Box>
        )}
        <Flex
          width="100%"
          justify="between"
          align="center"
          py="3"
          px="4"
          className="bg-yellow transfer-card"
        >
          {normalizedSelectedTokens.from ? (
            <Flex direction="column" justify="between" gap="1">
              <TokenNumberInput
                decimalLimit={normalizedSelectedTokens?.from?.decimals}
                value={'' + amount}
                onChange={setAmount}
                hasError={!isValidAmount}
              />
              {!isValidAmount && (
                <Text size="1" className="text-color-error">
                  Amount must be greater than 0 and less than or equal to
                  available amount
                </Text>
              )}
              <Text size="1">{`Available: ${normalizedSelectedTokens?.from?.uiAmount}`}</Text>
            </Flex>
          ) : (
            <Text size="5" weight="bold">
              Select culture
            </Text>
          )}
          <Flex direction="column" justify="between" align="end" gap="1">
            <Select
              mode="btn"
              onClick={() => changeSelected('from')}
              value={normalizedSelectedTokens?.from?.name}
            />

            {normalizedSelectedTokens.from && (
              <Text
                size="1"
                className="transfer-card-max"
                onClick={() =>
                  setAmount(normalizedSelectedTokens?.from?.uiAmount || 0)
                }
              >
                Max
              </Text>
            )}
          </Flex>
        </Flex>

        <ConvertIconArrow
          swapSelectedTokensPlaces={() => {
            swapSelectedTokensPlaces();
            setAmount(
              (swapRoutes?.outAmount || 0) /
                10 ** (normalizedSelectedTokens?.to?.decimals || 0) || 0.01
            );
          }}
        />

        <Flex
          width="100%"
          justify="between"
          align="center"
          py="3"
          px="4"
          className="bg-yellow transfer-card"
        >
          {!normalizedSelectedTokens.to && (
            <Text size="5" weight="bold">
              Select culture
            </Text>
          )}

          {isSwapRoutesLoading ? (
            <Spinner size="3" />
          ) : (
            <Text size="5" weight="bold">
              {swapRoutes
                ? formatNumberToUsFormat(
                    normalizedSelectedTokens?.to?.decimals
                  ).format(
                    swapRoutes.outAmount /
                      10 ** (normalizedSelectedTokens?.to?.decimals || 0)
                  )
                : swapRoutes}
            </Text>
          )}

          <Select
            mode="btn"
            onClick={() => changeSelected('to')}
            defaultValue={2}
            value={normalizedSelectedTokens?.to?.name}
          />
        </Flex>
        {normalizedSelectedTokens.from && normalizedSelectedTokens.to && (
          <SlideButton
            ref={btnRef}
            disabled={
              !swapRoutes ||
              isSwapRoutesLoading ||
              mutation.isPending ||
              !isValidAmount ||
              minimumNotMet
            }
            handleSubmit={handleSwapSubmit}
            loading={mutation.isPending}
            label={
              mutation.isPending ? 'Waiting for a transaction end' : undefined
            }
          />
        )}
      </Flex>
    );
  }
);

ConvertForm.displayName = 'ConvertForm';
