'use client';

import { Box, Flex, Text } from '@radix-ui/themes';

import './style.scss';
import { Icon, Select, SlideButton } from '@/legos';

export const ConvertItem = () => (
  <Flex width="100%" direction="column" align="center" px="4" pb="6" gap="5">
    <Text size="4" weight="bold">
      Convert MICHI to USDC
    </Text>
    <Flex
      width="100%"
      justify="between"
      py="3"
      px="4"
      className="bg-yellow transfer-card"
    >
      <Flex direction="column" justify="between" gap="1">
        <Text size="5" weight="bold">
          {123831}
        </Text>
        <Text size="1">{`Available: 3,210,563`}</Text>
      </Flex>
      <Flex direction="column" justify="between" align="end" gap="1">
        <Select
          values={[
            { id: 1, value: 'USDT' },
            { id: 2, value: 'MICHI' },
            { id: 3, value: 'BTC' },
          ]}
        />

        <Text size="1" className="transfer-card-max">
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
      py="3"
      px="4"
      className="bg-yellow transfer-card"
    >
      <Text size="5" weight="bold">
        342,659
      </Text>

      <Select
        defaultValue={2}
        values={[
          { id: 1, value: 'USDT' },
          { id: 2, value: 'MICHI' },
          { id: 3, value: 'BTC' },
        ]}
      />
    </Flex>
    <SlideButton />
  </Flex>
);
