import { Flex, Text } from '@radix-ui/themes';
import React, { FC, InputHTMLAttributes, RefObject } from 'react';

import './style.scss';
import { Icon, IconsNames } from '../Icon';
import { useWidth } from '@/hooks/useWidth';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  errorClassName?: string;
  label?: string;
  error?: boolean;
  errorText?: string;
  icon?: IconsNames;
  endAdornment?: React.ReactNode;
}

export const Input: FC<Props> = ({
  className,
  errorClassName,
  label,
  error,
  errorText,
  icon,
  endAdornment,
  ...props
}) => {
  const { mdScreen } = useWidth();
  return (
    <Flex width="100%" direction="column" position="relative">
      {label ? <Text size={mdScreen ? '3' : '2'}>{label}</Text> : null}
      <div className="default-input-wrapper">
        <input
          className={`default-input ${className ?? ''} ${error ? 'error' : ''}`}
          {...props}
        />
        {(props?.type === 'search' && icon && !props?.value) ||
        (props?.type !== 'search' && icon) ? (
          <div className="default-input-icon">
            <Icon icon={icon} />
          </div>
        ) : null}
        {endAdornment ? (
          <div className="default-input-icon">{endAdornment}</div>
        ) : null}
      </div>
      {error ? (
        <Text
          size={mdScreen ? '3' : '1'}
          mt="1"
          className={`default-input-error ${errorClassName ?? ''}`}
        >
          {errorText}
        </Text>
      ) : null}
    </Flex>
  );
};
