import { FC } from 'react';
import axios from 'axios';
import { Flex, Text } from '@radix-ui/themes';

import { useWidth } from '@/hooks/useWidth';

import './style.scss';

interface Props {
  delayRemaining: Date | null;
}

const getDelayLabel = (delayRemaining: Date) => {
  if (new Date(delayRemaining).getDay() > new Date().getDay()) {
    return `${new Date(delayRemaining).getDay() - new Date().getDay()} ${
      new Date(delayRemaining).getHours() > 1 ? 'days' : 'day'
    }`;
  }
  if (new Date(delayRemaining).getHours() > new Date().getHours()) {
    return `${new Date(delayRemaining).getHours() - new Date().getHours()} ${
      new Date(delayRemaining).getHours() > 1 ? 'hours' : 'hour'
    }`;
  }
  if (new Date(delayRemaining).getMinutes() > new Date().getMinutes()) {
    return `${
      new Date(delayRemaining).getMinutes() - new Date().getMinutes()
    } ${new Date(delayRemaining).getMinutes() > 1 ? 'minutes' : 'minute'}`;
  }
};

export const ExportRemaining: FC<Props> = ({ delayRemaining }) => {
  const { mdScreen } = useWidth();

  const delayRemainingLabel = delayRemaining
    ? getDelayLabel(delayRemaining)
    : '';

  return delayRemaining ? (
    <Flex
      direction="column"
      align="center"
      gap="5"
      py="4"
      px="2"
      className="export-remaining-card"
    >
      <Text
        size={mdScreen ? '6' : '5'}
        weight="medium"
        align="center"
      >{`${delayRemainingLabel} remaining`}</Text>
      <Text size={mdScreen ? '4' : '3'} weight="medium" align="center">
        Your recovery phrase is being generated. You will receive a notification
        once it&apos;s ready. Please check back shortly.
      </Text>
    </Flex>
  ) : null;
};
