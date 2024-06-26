'use client';

import { Flex, Text } from '@radix-ui/themes';

import './style.scss';
import { useWidth } from '@/hooks/useWidth';

export const DesktopMessage = () => {
  const { xlScreen } = useWidth();
  return (
    <>
      {xlScreen ? (
        <Flex
          direction="column"
          maxWidth="367px"
          className="desktop-message-card"
        >
          <Text size="4" weight="medium">
            Desktop Version Coming Soon!
          </Text>
          <Text size="2">
            For the best experience, please view on your mobile device and
            install our Progressive Web App.
          </Text>
        </Flex>
      ) : null}
    </>
  );
};
