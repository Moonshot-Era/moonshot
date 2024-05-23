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
  | 'share'
  | 'solana'
  | 'baseStatus'
  | 'message'
  | 'trendingDown'
  | 'fileDownload'
  | 'twitter'
  | 'shift4'
  | 'chartBar'
  | 'chartPie'
  | 'chartLine'
  | 'coins'
  | 'shift4'
  | 'switchHorizontal'
  | 'userCircle'
  | 'notes'
  | 'key'
  | 'logout'
  | 'alertTriangle';

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
  stroke?: string;
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
  stroke?: string;
};
