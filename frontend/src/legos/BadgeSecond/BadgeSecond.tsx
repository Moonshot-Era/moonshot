import React, { FC } from 'react';
import { Text } from '@radix-ui/themes';

import './style.scss';
import { Icon } from '../Icon';
import { useWidth } from '@/hooks/useWidth';
import { formatNumberToUsd } from '@/helpers/helpers';

interface Props {
  percent: number;
  total: number;
}

export const BadgeSecond: FC<Props> = ({ percent, total }) => {
  const { mdScreen } = useWidth();
  return (
    <div className="badge-second-container">
      <div
        className={`badge-second-total ${
          total > 0 ? 'bg-success' : 'bg-error'
        }`}
      >
        {total !== 0 && (
          <Icon icon={total > 0 ? 'trendingUp' : 'trendingDown'} />
        )}
        <Text size={mdScreen ? '3' : '2'} weight="medium">
          {formatNumberToUsd().format(total)}
        </Text>
      </div>
      <Text
        className="badge-second-percent"
        size={mdScreen ? '3' : '2'}
        weight="medium"
      >{`${total >= 0 ? '' : '-'}${(100 - percent * 100).toFixed(2)}%`}</Text>
    </div>
  );
};
