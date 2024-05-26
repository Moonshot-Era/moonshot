"use client";

import { memo, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Box, Flex, Spinner, Text } from "@radix-ui/themes";
import {
  convertToInteger,
  convertToReadable,
} from "@/helpers/convertAmountToInt";
import { Icon, Select, SlideButton, TokenNumberInput } from "@/legos";

import { SelectedTokens } from "./types";
import { useSwapMutation, useSwapRoutes } from "./hooks";
import "./style.scss";

type ConvertForm = {
  changeSelected?: (reselect: string) => void;
  selectedTokens: SelectedTokens;
};

export const ConvertForm = memo(
  ({ selectedTokens, changeSelected }: ConvertForm) => {
    const [amount, setAmount] = useState<number>(0.001);

    const { swapRoutes, isLoading: isSwapRoutesLoading } = useSwapRoutes(
      selectedTokens,
      convertToInteger(amount, selectedTokens.from.decimals as number),
      1
    );

    const mutation = useSwapMutation();

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
          Convert {selectedTokens.from.name} to {selectedTokens.to.name}
        </Text>
        <Flex
          width="100%"
          justify="between"
          py="3"
          px="4"
          className="bg-yellow transfer-card"
        >
          <Flex direction="column" justify="between" gap="1">
            <TokenNumberInput
              decimalLimit={selectedTokens.from.decimals as number}
              value={"" + amount}
              onChange={setAmount}
            />

            <Text size="1">{`Available: ${selectedTokens.from.valueUsd}`}</Text>
          </Flex>
          <Flex direction="column" justify="between" align="end" gap="1">
            <Select
              mode="btn"
              onClick={() => changeSelected("from")}
              value={selectedTokens.from.name}
            />

            <Text
              size="1"
              className="transfer-card-max"
              onClick={() => setAmount(selectedTokens.from.valueUsd)}
            >
              Max
            </Text>
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
          {isSwapRoutesLoading ? (
            <Spinner size="3" />
          ) : (
            <Text size="5" weight="bold">
              {swapRoutes
                ? convertToReadable(
                    swapRoutes.outAmount,
                    selectedTokens.to.decimals
                  )
                : swapRoutes}
            </Text>
          )}

          <Select
            mode="btn"
            onClick={() => changeSelected("to")}
            defaultValue={2}
            value={selectedTokens.to.name}
          />
        </Flex>
        <SlideButton
          disabled={!swapRoutes || isSwapRoutesLoading || mutation.isPending}
          handleSubmit={() => mutation.mutate({ swapRoutes })}
        />
      </Flex>
    );
  }
);
