import { Flex, Text } from '@radix-ui/themes';
import React, { FC, InputHTMLAttributes } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  label?: string;
  error?: boolean;
  errorText?: string;
}

export const Input: FC<Props> = ({
  className,
  label,
  error,
  errorText,
  ...props
}) => (
  <Flex direction="column" height="76px">
    {label ? <Text size="2">{label}</Text> : null}
    <input className={`default-input ${className}`} {...props} />
    {error ? (
      <Text size="1" mt="1" className="default-input-error">
        {errorText}
      </Text>
    ) : null}
  </Flex>
);
