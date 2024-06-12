import React, { FC } from 'react';
import { Text } from '@radix-ui/themes';

import './style.scss';
import { Icon } from '../Icon';
import { useWidth } from '@/hooks/useWidth';

interface Props {
  percent: number;
  total: number;
}

export const Badge: FC<Props> = ({ percent, total }) => {
  const { mdScreen } = useWidth();

  return (
    <div
      className={`badge-container box-shadow ${
        total > 0 ? 'bg-success' : 'bg-error'
      }`}
    >
      <Icon icon={total > 0 ? 'trendingUp' : 'trendingDown'} />
      <Text size={mdScreen ? '3' : '2'} weight="regular">{`${percent}%`}</Text>
      <Text size={mdScreen ? '3' : '2'} weight="regular">{`($${total})`}</Text>
    </div>
  );
};
