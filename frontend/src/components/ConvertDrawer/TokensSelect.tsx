"use client";

import { FC } from "react";
import { Box, Flex, Text } from "@radix-ui/themes";
import { Input, TokenCard } from "@/legos";

import "./style.scss";

interface Props {
  tokensList: void;
  handleTokenSelect: () => void;
  selectMode: "to" | "from";
}

export const TokensSelect: FC<Props> = ({
  tokensList,
  handleTokenSelect,
  selectMode,
}) => (
  <Flex
    width="100%"
    direction="column"
    align="center"
    gap="4"
    pb="6"
    position="relative"
  >
    <Flex className="search-input-holder" pb="2" px="4" direction="column">
      <Text size="4" weight="bold" align="center" mb="2">
        Convert {selectMode === "to" ? "to" : "from"}
      </Text>
      <Input placeholder="Search assets" icon="search" />
    </Flex>
    <Flex width="100%" direction="column" gap="4" px="4">
      {tokensList.map((token, index) => (
        <TokenCard
          key={token.address}
          token={token}
          onClick={() => handleTokenSelect(token)}
        />
      ))}
    </Flex>
  </Flex>
);
