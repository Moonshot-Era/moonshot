'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Box, Flex, Text } from '@radix-ui/themes';

import './style.scss';
import userIcon from '../../assets/images/user-icon.png';

import { Toolbar } from '../Toolbar/Toolbar';
import { Icon, Input, TokenCard } from '@/legos';

const mockUserData = {
  name: 'jeo boden',
  balance: 21439,
  subtitle: '43,453 BODEN',
  marketCap: '$400.5M',
  volume: '$10.6M',
  allTimeHigh: '$1.0835',
  totalSupply: '879,906,378.25',
  holders: '4,683',
  description:
    'Joe Boden is da hartfelt leeder of Amuriku. His mishun is to bild bak betta, to unify da divided, n to counter da wild claims of Doland Tremp. We’re here to bring togetha all da Amuriku memes and support one anotha thru da highs and lows. Make sure to stand by Boden for real change!',
};

export const ExploreContent = () => {
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
          <Flex width="100%" direction="column" gap="4">
            <Input placeholder="Search assets" icon="search" />
            {Array(10)
              .fill(10)
              .map((item, index) => (
                <TokenCard
                  key={index}
                  logo=""
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
          <Flex direction="column" width="100%" gap="4">
            <Flex
              position="relative"
              width="100%"
              justify="center"
              align="center"
              direction="row"
              mb="8"
            >
              <Text size="4" weight="bold">
                {mockUserData.name}
              </Text>
              <Box
                position="absolute"
                left="0"
                className="explore-icon-arrow"
                onClick={toggleIsProfile}
              >
                <Icon icon="arrowRight" />
              </Box>
            </Flex>
            <Toolbar withShare />

            <Flex
              direction="row"
              p="4"
              justify="between"
              className="explore-card"
            >
              <Flex width="100%" direction="column" justify="between">
                <Text size="3" weight="medium">
                  Your balance
                </Text>
                <Text size="2" weight="medium">
                  {`$${mockUserData.balance.numbersArray[0]}`}
                </Text>
              </Flex>
              <Flex
                width="100%"
                direction="column"
                justify="between"
                align="end"
              >
                <Image width={24} height={24} alt="user-icon" src={userIcon} />
                <Text size="1" mt="1">
                  {mockUserData.subtitle}
                </Text>
              </Flex>
            </Flex>
            <Flex
              direction="column"
              p="4"
              justify="between"
              className="explore-card"
            >
              <Text
                size="3"
                weight="medium"
                mb="2"
              >{`About ${mockUserData.name}`}</Text>
              <Text size="1">{mockUserData.description}</Text>
            </Flex>
            <Flex
              direction="column"
              p="4"
              gap="2"
              justify="between"
              className="explore-card"
            >
              <Text size="3" weight="medium" mb="2">
                Stats
              </Text>
              <Flex direction="row" justify="between" align="center">
                <Flex direction="row" gap="1">
                  <Icon icon="chartPie" width={14} height={14} />
                  <Text size="1" weight="medium">
                    Market cap
                  </Text>
                </Flex>
                <Text size="1">{mockUserData.marketCap}</Text>
              </Flex>
              <Flex direction="row" justify="between" align="center">
                <Flex direction="row" gap="1">
                  <Icon icon="chartBar" width={14} height={14} />
                  <Text size="1" weight="medium">
                    24H volume
                  </Text>
                </Flex>
                <Text size="1">{mockUserData.volume}</Text>
              </Flex>
              <Flex direction="row" justify="between" align="center">
                <Flex direction="row" gap="1">
                  <Icon icon="chartLine" width={14} height={14} />
                  <Text size="1" weight="medium">
                    All-time high
                  </Text>
                </Flex>
                <Text size="1">{mockUserData.allTimeHigh}</Text>
              </Flex>
              <Flex direction="row" justify="between" align="center">
                <Flex direction="row" gap="1">
                  <Icon icon="coins" width={14} height={14} />
                  <Text size="1" weight="medium">
                    Total supply
                  </Text>
                </Flex>
                <Text size="1">{mockUserData.totalSupply}</Text>
              </Flex>
              <Flex direction="row" justify="between" align="center">
                <Flex direction="row" gap="1">
                  <Icon icon="wallet" width={14} height={14} stroke={'2'} />
                  <Text size="1" weight="medium">
                    Holders
                  </Text>
                </Flex>
                <Text size="1">{mockUserData.holders}</Text>
              </Flex>
            </Flex>
          </Flex>
        )}
      </Flex>
    </>
  );
};
