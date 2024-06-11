'use client';

import { Box, Flex, Text } from '@radix-ui/themes';

import './style.scss';

export const TransactionsEmpty = () => (
  <Flex
    direction="column"
    align="center"
    justify="center"
    width="100%"
    height="60vh"
    className="main-wrapper"
  >
    <Box width="154" p="4" className="no-activity-card">
      <Text size="5" weight="medium">
        No activity
      </Text>
    </Box>
  </Flex>
);
