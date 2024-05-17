import React, { ReactNode, ButtonHTMLAttributes, FC } from 'react';

import './style.scss';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export const NavButton: FC<ButtonProps> = ({
  children,
  className,
  ...props
}) => (
  <button className={`nav-button ${className}`} {...props}>
    {children}
  </button>
);
