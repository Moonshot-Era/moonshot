import React, { ReactNode, ButtonHTMLAttributes, FC } from "react";

import "./style.scss";
import { IconsNames } from "../Icon/types";
import { Icon } from "../Icon/Icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconsNames;
  size?: "default" | "small";
}

export const IconButton: FC<ButtonProps> = ({
  className,
  icon,
  size = "default",
  ...props
}) => (
  <button className={`icon-button ${size} ${className}`} {...props}>
    <Icon icon={icon} />
  </button>
);
