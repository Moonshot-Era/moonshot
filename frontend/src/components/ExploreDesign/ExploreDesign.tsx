'use client';

import { Box, Flex, Text } from '@radix-ui/themes';

import './style.scss';
import { formatNumber } from '@/helpers/helpers';
import { BadgeSecond, Icon, IconButton, TokenCard } from '@/legos';
import { useState } from 'react';

const mockBalance = 123831.74;

const formatBalance = formatNumber(mockBalance);

export const ExploreDesign = () => {
  const [isProfile, setIsProfile] = useState(false);

  const toggleIsProfile = () => setIsProfile(!isProfile);

  return (
    <>
      <Flex
        direction="column"
        align="center"
        justify="center"
        width="100%"
        className="main-wrapper explore-wrapper"
      >
        {!isProfile ? (
          <Flex
            width="100%"
            direction="column"
            gap="4"
            mb={mockBalance > 0 ? '100px' : '1'}
          >
            {Array(10)
              .fill(10)
              .map((item, index) => (
                <TokenCard
                  key={index}
                  name="jeo boden"
                  currencyType="baseStatus"
                  percent={2.7}
                  total={21938}
                  description="43,453 BODEN"
                  handler={toggleIsProfile}
                />
              ))}
          </Flex>
        ) : (
          <Flex direction="column" align="center">
            <Flex position="relative" width="100%" direction="row">
              <Text size="4" weight="bold">
                jeo boden
              </Text>
              <Box position="absolute" left="0" className="explore-icon-arrow">
                <Icon icon="arrowRight" />
              </Box>
            </Flex>
          </Flex>
        )}
      </Flex>
    </>
  );
};
