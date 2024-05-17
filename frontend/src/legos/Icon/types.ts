import { CSSProperties, ElementType } from 'react';

export type IconsNames =
  | 'google'
  | 'apple'
  | 'home'
  | 'search'
  | 'settings'
  | 'chevronRight'
  | 'arrowRight'
  | 'trendingUp'
  | 'selector'
  | 'wallet'
  | 'deposit'
  | 'transfer'
  | 'withdraw'
  | 'send'
  | 'solana'
  | 'baseStatus'
  | 'trendingDown'
  | 'twitter';

export type IconsNamesMapType = {
  [key in IconsNames]: ElementType;
};

export interface IconProps {
  width?: number | string;
  height?: number | string;
  color?: string;
  icon: IconsNames;
  size?: string | number;
  fill?: string;
  style?: CSSProperties & { pathColor?: string; circleOpacity?: number };
}

export type IconCommonProps = {
  width?: number | string;
  height?: number | string;
  circleOpacity?: number;
  pathColor?: string;
  style?: CSSProperties & { pathColor?: string; circleOpacity?: number };
  color?: string;
  fill?: string;
};
