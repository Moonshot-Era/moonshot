import { CSSProperties, ElementType } from 'react';

export type IconsNames =
  | 'google'
  | 'apple'
  | 'home'
  | 'explore'
  | 'settings'
  | 'arrowRight'
  | 'arrowRight2'
  | 'trendingUp'
  | 'chevronsUpDown'
  | 'wallet'
  | 'deposit'
  | 'convert'
  | 'withdraw'
  | 'share'
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
