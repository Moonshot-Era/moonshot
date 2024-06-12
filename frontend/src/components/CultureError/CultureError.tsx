'use client';

import { Box, Flex, Text } from '@radix-ui/themes';

import './style.scss';
import { useWidth } from '@/hooks/useWidth';

export const CultureError = () => {
  const { mdScreen } = useWidth();

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      width="100%"
      height="100vh"
      pb="80px"
      className="main-wrapper"
    >
      <Box width="100%" p="3" className="explore-error-card">
        <Text size={mdScreen ? '6' : '5'} weight="medium">
          Nothing to show here!
        </Text>
      </Box>
    </Flex>
  );
};
