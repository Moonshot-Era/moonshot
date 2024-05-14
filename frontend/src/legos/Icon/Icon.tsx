import { FC } from 'react';

import { IconProps } from './types';
import { IconsMap } from './helpers';

export const Icon: FC<IconProps> = ({
  icon,
  height,
  width,
  color,
  size,
  ...props
}) => {
  const Render = IconsMap[icon];

  const computedColor = color ?? 'currentColor';

  return (
    <Render
      fontSize={size}
      height={height || size}
      width={width || size}
      color={computedColor}
      {...props}
    />
  );
};

export * from './types';
