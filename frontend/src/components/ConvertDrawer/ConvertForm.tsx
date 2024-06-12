'use client';

import { memo, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Box, Flex, Spinner, Text } from '@radix-ui/themes';
import {
  convertToInteger,
  convertToReadable
} from '@/helpers/convertAmountToInt';
import { Icon, Select, SlideButton, TokenNumberInput } from '@/legos';

import { SelectedTokens } from './types';
import { useSwapMutation, useSwapRoutes } from './hooks';
import './style.scss';
import { snackbar } from '@/helpers/snackbar';

type ConvertForm = {
  changeSelected: (reselect: string) => void;
  selectedTokens: SelectedTokens;
  closeDrawer: () => void;
};

export const ConvertForm = memo(
  ({ selectedTokens, changeSelected, closeDrawer }: ConvertForm) => {
    const [amount, setAmount] = useState<number | string>(0.001);
    const btnRef = useRef();
    const [isValidAmount, setIsValidAmount] = useState(true);
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
      if (mutation.isSuccess) {
        snackbar('success', `Finished converting!`);
        closeDrawer();
      }
    }, [mutation.isSuccess]);

    useEffect(() => {
      if (mutation.isError) {
        snackbar('error', `Something went wrong, please try again.`);
        //@ts-ignore
        btnRef.current?.resetSlide();
      }
    }, [mutation.isError]);

    const handleSwapSubmit = () => {
      //@ts-ignore
      mutation.mutate({ swapRoutes });
      // @ts-ignore
      // toast.promise(() => mutation.mutate({ swapRoutes }), {
      //   loading: `Converting ${amount} ${
      //     selectedTokens?.from?.symbol
      //   } into ${convertToReadable(
      //     // @ts-ignore
      //     swapRoutes?.outAmount,
      //     selectedTokens?.to?.tokenOverview?.attributes?.decimals || 0
      //   )} ${selectedTokens?.to?.included?.attributes.symbol}`,
      //   success: mutation.isSuccess,
      //   error: mutation.isError,
      //   dismissible: true,
      //   className: 'snackbar-promise',
      //   position: 'top-center'
      // });
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
                ? convertToReadable(
                    // @ts-ignore
                    swapRoutes.outAmount,
                    selectedTokens?.to?.tokenOverview?.attributes?.decimals || 0
                  )
                : swapRoutes}
            </Text>
          )}

          <Select
            mode="btn"
            onClick={() => changeSelected('to')}
            defaultValue={2}
            value={selectedTokens?.to?.included?.attributes.symbol}
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
