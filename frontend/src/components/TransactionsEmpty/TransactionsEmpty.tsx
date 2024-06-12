'use client';

import { Box, Flex, Text } from '@radix-ui/themes';

import './style.scss';
import { useWidth } from '@/hooks/useWidth';

export const TransactionsEmpty = () => {
  const { mdScreen } = useWidth();

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      width="100%"
      height="60vh"
      className="main-wrapper"
    >
      <Box width="154" p="4" className="no-activity-card">
        <Text size={mdScreen ? '6' : '5'} weight="medium">
          No activity
        </Text>
      </Box>
    </Flex>
  );
};
