'use client';
import { SelectHTMLAttributes, FC } from 'react';

import './style.scss';

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  values: { value: string; id: number }[];
}

export const Select: FC<Props> = ({ values, ...props }) => (
  <select id="standard-select" className="convert-select" {...props}>
    {values.map(({ value, id }) => (
      <option key={id} value={id}>
        {value}
      </option>
    ))}
  </select>
);
