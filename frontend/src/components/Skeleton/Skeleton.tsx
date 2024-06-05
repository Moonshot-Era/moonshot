import { FC } from 'react';

import { SkeletonHome } from './components/SkeletonHome/SkeletonHome';
import { SkeletonExplore } from './components/SkeletonExplore/SkeletonExplore';
import { SkeletonCulture } from './components/SkeletonCulture/SkeletonCulture';
import { SkeletonTransactions } from './components/SkeletonTransactions/SkeletonTransactions';

interface Props {
  variant: 'home' | 'explore' | 'culture' | 'transactions';
}

export const Skeleton: FC<Props> = ({ variant }) => {
  switch (variant) {
    case 'home':
      return <SkeletonHome />;
    case 'explore':
      return <SkeletonExplore />;
    case 'culture':
      return <SkeletonCulture />;
    case 'transactions':
      return <SkeletonTransactions />;
    default:
      return <SkeletonHome />;
  }
};
