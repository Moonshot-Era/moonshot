'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Flex, Text } from '@radix-ui/themes';

import './style.scss';
import { useWidth } from '@/hooks/useWidth';
import cubistLogo from '../../assets/images/cubist_logo.svg';

export const SplashScreen = () => {
  const { mdScreen } = useWidth();

  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [isVisibility, setIsVisibility] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsVisibility(true);
    }, 100);
    setTimeout(() => {
      setIsPageLoaded(true);
    }, 800);
  }, []);

  return (
    <>
      {!isPageLoaded ? (
        <Flex
          className="splash-container"
          style={{
            opacity: isVisibility ? 0 : 100,
            transition: 'all 0.7s'
          }}
        >
          <Flex direction="column" align="center" justify="center" flexGrow="1">
            <Text size="8" weight="bold">
              Moonshot
            </Text>
            <Text size={mdScreen ? '4' : '3'} weight="medium">
              Trade Culture
            </Text>
          </Flex>
          <Flex direction="row" position="absolute" bottom="50px">
            <Text size={mdScreen ? '3' : '1'}>Powered by</Text>
            <Image src={cubistLogo} alt="cubist-logo" />
          </Flex>
        </Flex>
      ) : null}
    </>
  );
};
