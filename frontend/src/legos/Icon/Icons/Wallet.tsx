import { IconWallet } from '@tabler/icons-react';

import { IconCommonProps } from '../types';

export const Wallet = (style: IconCommonProps) => (
  <IconWallet stroke={style.stroke ?? 1.5} style={style} />
);
