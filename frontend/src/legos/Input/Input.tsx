import { Flex, Text } from '@radix-ui/themes';
import React, { FC, InputHTMLAttributes } from 'react';

import './style.scss';
import { Icon, IconsNames } from '../Icon';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  label?: string;
  error?: boolean;
  errorText?: string;
  icon?: IconsNames;
}

export const Input: FC<Props> = ({
  className,
  label,
  error,
  errorText,
  icon,
  ...props
}) => (
  <Flex width="100%" direction="column">
    {label ? <Text size="2">{label}</Text> : null}
    <div className="default-input-wrapper">
      <input className={`default-input ${className ?? ''}`} {...props} />
      {icon ? (
        <div className="default-input-icon">
          <Icon icon={icon} />
        </div>
      ) : null}
    </div>
    {error ? (
      <Text size="1" mt="1" className="default-input-error">
        {errorText}
      </Text>
    ) : null}
  </Flex>
);
