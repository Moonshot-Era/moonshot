import React, { ReactNode, ButtonHTMLAttributes, FC } from 'react';

import './style.scss';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export const IconButton: FC<ButtonProps> = ({
  children,
  className,
  ...props
}) => (
  <button className={`icon-button ${className}`} {...props}>
    {children}
  </button>
);
