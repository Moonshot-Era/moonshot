import { FC } from 'react';
import { Flex, Text } from '@radix-ui/themes';

import { useWidth } from '@/hooks/useWidth';

import './style.scss';

interface Props {
  delayRemaining: Date | null;
}

const getDelayLabel = (delayRemaining: Date) => {
  if (delayRemaining.getDate() > new Date().getDate()) {
    return `${delayRemaining.getDate() - new Date().getDate()} ${
      delayRemaining.getDate() > 1 ? 'days' : 'day'
    }`;
  }
  if (delayRemaining.getHours() > new Date().getHours()) {
    return `${delayRemaining.getHours() - new Date().getHours()} ${
      delayRemaining.getHours() > 1 ? 'hours' : 'hour'
    }`;
  }
  if (delayRemaining.getMinutes() > new Date().getMinutes()) {
    return `${delayRemaining.getMinutes() - new Date().getMinutes()} ${
      delayRemaining.getMinutes() > 1 ? 'minutes' : 'minute'
    }`;
  }
  return ''
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
