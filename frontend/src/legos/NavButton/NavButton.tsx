import React, { ReactNode, ButtonHTMLAttributes, FC } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export const NavButton: FC<ButtonProps> = ({
  children,
  className,
  ...props
}) => (
  <button className={`box-shadow nav-button ${className}`} {...props}>
    {children}
  </button>
);
