import React, { FC } from 'react';
import { Text } from '@radix-ui/themes';

import './style.scss';
import { Icon } from '../Icon';
import { formatNumberToUsd } from '@/helpers/helpers';

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
      <Text size="2" weight="medium">
        {formatNumberToUsd().format(total)}
      </Text>
    </div>
    <Text className="badge-second-percent" size="2" weight="medium">{`${(
      1 - percent
    ).toFixed(2)}%`}</Text>
  </div>
);
