import React, { FC } from 'react';
import { Text } from '@radix-ui/themes';

import { Icon } from '../Icon';

interface Props {
  percent: number;
  total: number;
}

export const BadgeSecond: FC<Props> = ({ percent, total }) => (
  <div className="badge-second-container">
    <div
      className={`badge-second-total ${total > 0 ? 'bg-success' : 'bg-error'}`}
    >
      <Icon icon={total > 0 ? 'trendingUp' : 'trendingDown'} />
      <Text size="2" weight="regular">{`($${total})`}</Text>
    </div>
    <Text
      className="badge-second-percent"
      size="2"
      weight="regular"
    >{`${percent}%`}</Text>
  </div>
);
