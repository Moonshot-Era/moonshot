'use client';

import { memo, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Box, Flex, Spinner, Text } from '@radix-ui/themes';
import { convertToInteger } from '@/helpers/convertAmountToInt';
import { Icon, Select, SlideButton, TokenNumberInput } from '@/legos';

import { SelectedTokens } from './types';
import { useSwapMutation, useSwapRoutes } from './hooks';
import './style.scss';
import { snackbar } from '@/helpers/snackbar';
import { formatNumberToUsFormat } from '@/helpers/helpers';
import { useLogout } from '@/hooks';

type ConvertForm = {
  changeSelected: (reselect: string) => void;
  selectedTokens: SelectedTokens;
  closeDrawer: () => void;
  walletAddress: string;
};

export const ConvertForm = memo(
  ({
    selectedTokens,
    changeSelected,
    closeDrawer,
    walletAddress
  }: ConvertForm) => {
    const [amount, setAmount] = useState<number | string>(0.001);
    const btnRef = useRef();
    const [isValidAmount, setIsValidAmount] = useState(true);
    const logout = useLogout();

    const label =
      selectedTokens?.from && selectedTokens?.to
        ? `
      Convert ${selectedTokens?.from?.name} to ${selectedTokens.to?.included?.attributes.name}
    `
        : 'Convert';

    useEffect(() => {
      const numericAmount = +amount;
      const isValid =
        numericAmount > 0 && numericAmount <= selectedTokens?.from?.uiAmount!;
      setIsValidAmount(isValid);
    }, [amount, selectedTokens?.from?.uiAmount]);

    const { swapRoutes, isLoading: isSwapRoutesLoading } = useSwapRoutes(
      selectedTokens,
      convertToInteger(+amount, selectedTokens?.from?.decimals as number),
      50,
      isValidAmount
    );

    const mutation = useSwapMutation();

    useEffect(() => {
      if (mutation.isError) {
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
                tokenAddress: selectedTokens?.from?.address,
                tokenDecimals: selectedTokens?.from?.decimals
              }
            }
          )
          .then((res) => {
            console.log(res);
            if (res?.data?.error?.statusText === 'Forbidden') {
              logout();
            }
            if (res?.data?.error?.statusText) {
              snackbar('error', res?.data?.error?.statusText);
            }
            if (res?.data?.txid) {
              snackbar('success', `Finished converting!`);
              closeDrawer();
            }
          })
          .catch((err) => {
            snackbar(
              'error',
              err?.message || `Something went wrong, please try again.`
            );
            //@ts-ignore
            btnRef.current?.resetSlide();
          })
          //@ts-ignore
          .finally(() => btnRef.current?.resetSlide()),
        {
          loading: `Converting ${amount} ${selectedTokens?.from?.name} into ${
            // @ts-ignore
            formatNumberToUsFormat(
              selectedTokens?.to?.tokenOverview?.attributes?.decimals || 0
            ).format(
              // @ts-ignore
              swapRoutes.outAmount /
                (10 **
                  (selectedTokens?.to?.tokenOverview?.attributes?.decimals ||
                    0) || 1)
            )
          } ${selectedTokens?.to?.included?.attributes.name}`,
          dismissible: true,
          className: 'snackbar-promise',
          position: 'top-center'
        }
      );
    };

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
        <Flex
          width="100%"
          justify="between"
          align="center"
          py="3"
          px="4"
          className="bg-yellow transfer-card"
        >
          {selectedTokens.from ? (
            <Flex direction="column" justify="between" gap="1">
              <TokenNumberInput
                decimalLimit={selectedTokens?.from?.decimals as number}
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
              <Text size="1">{`Available: ${selectedTokens?.from?.uiAmount}`}</Text>
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
              value={selectedTokens?.from?.name}
            />

            {selectedTokens.from && (
              <Text
                size="1"
                className="transfer-card-max"
                onClick={() => setAmount(selectedTokens?.from?.uiAmount || 0)}
              >
                Max
              </Text>
            )}
          </Flex>
        </Flex>
        <Box className="convert-icon-arrow">
          <Icon icon="arrowRight" />
        </Box>
        <Flex
          width="100%"
          justify="between"
          align="center"
          py="3"
          px="4"
          className="bg-yellow transfer-card"
        >
          {!selectedTokens.to && (
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
                    selectedTokens?.to?.tokenOverview?.attributes?.decimals || 0
                  ).format(
                    // @ts-ignore
                    swapRoutes.outAmount /
                      (10 **
                        (selectedTokens?.to?.tokenOverview?.attributes
                          ?.decimals || 0) || 1)
                  )
                : swapRoutes}
            </Text>
          )}

          <Select
            mode="btn"
            onClick={() => changeSelected('to')}
            defaultValue={2}
            value={selectedTokens?.to?.included?.attributes.name}
          />
        </Flex>
        {selectedTokens.from && selectedTokens.to && (
          <SlideButton
            ref={btnRef}
            disabled={
              !swapRoutes ||
              isSwapRoutesLoading ||
              mutation.isPending ||
              !isValidAmount
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
