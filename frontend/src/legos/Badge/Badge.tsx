import React, { ReactNode, FC } from 'react';

import { Icon } from '../Icon';
import { Text } from '@radix-ui/themes';

interface Props {
  percent: number;
  total: number;
}

export const Badge: FC<Props> = ({ percent, total }) => (
  <div
    className={`badge-container box-shadow ${
      total > 0 ? 'bg-success' : 'bg-error'
    }`}
  >
    <Icon icon={total > 0 ? 'trendingUp' : 'trendingDown'} />
    <Text size="2" weight="regular">{`${percent}%`}</Text>
    <Text size="2" weight="regular">{`($${total})`}</Text>
  </div>
);
