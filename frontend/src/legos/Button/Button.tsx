import React, { ReactNode, ButtonHTMLAttributes, FC } from 'react';

import './style.scss';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export const Button: FC<Props> = ({ children, className, ...props }) => (
  <button className={`box-shadow default-button ${className}`} {...props}>
    {children}
  </button>
);
