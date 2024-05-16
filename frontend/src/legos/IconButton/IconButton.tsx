import React, { ReactNode, ButtonHTMLAttributes, FC } from 'react';

import './style.scss';
import { IconsNames } from '../Icon/types';
import { Icon } from '../Icon/Icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconsNames;
}

export const IconButton: FC<ButtonProps> = ({ className, icon, ...props }) => (
  <button className={`icon-button ${className}`} {...props}>
    <Icon icon={icon} />
  </button>
);
