import { Flex, Text } from '@radix-ui/themes';

import { Icon } from '@/legos';

export default function Home() {
  return (
    <main>
      <Flex direction="column" p="5">
        <Icon icon="google" />
        <Icon icon="apple" />
        <Icon icon="home" />
        <Icon icon="explore" />
        <Icon icon="settings" />
        <Icon icon="arrowRight" />
        <Icon icon="arrowRight2" />
        <Icon icon="trendingUp" />
        <Icon icon="chevronsUpDown" />
        <Icon icon="wallet" />
        <Icon icon="deposit" />
        <Icon icon="convert" />
        <Icon icon="withdraw" />
        <Icon icon="share" />
        <Icon icon="solana" />
        <Icon icon="baseStatus" />
        <Text size="9" weight="regular">
          TEXT
        </Text>
        <Text size="8" weight="regular">
          TEXT
        </Text>
        <Text size="7" weight="regular">
          TEXT
        </Text>
        <Text size="6" weight="regular">
          TEXT
        </Text>
        <Text size="5" weight="regular">
          TEXT
        </Text>
        <Text size="4" weight="regular">
          TEXT
        </Text>
        <Text size="3" weight="regular">
          TEXT
        </Text>
        <Text size="2" weight="regular">
          TEXT
        </Text>
        <Text size="1" weight="regular">
          TEXT
        </Text>
      </Flex>
    </main>
  );
}
