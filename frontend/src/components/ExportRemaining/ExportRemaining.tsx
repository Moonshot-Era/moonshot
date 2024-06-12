import { FC } from 'react';
import { Flex, Text } from '@radix-ui/themes';

import './style.scss';

interface Props {
  daysRemaining: number;
}

export const ExportRemaining: FC<Props> = ({ daysRemaining }) => (
  <Flex
    direction="column"
    align="center"
    gap="5"
    py="4"
    px="2"
    mx="37px"
    className="export-remaining-card"
  >
    <Text
      size="5"
      weight="medium"
      align="center"
    >{`${daysRemaining} days remaining`}</Text>
    <Text size="3" weight="medium" align="center">
      Your recovery phrase is being generated. You will receive a notification
      once it&apos;s ready. Please check back shortly.
    </Text>
  </Flex>
);
