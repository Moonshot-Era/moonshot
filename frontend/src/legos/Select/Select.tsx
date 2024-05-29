'use client';
import { SelectHTMLAttributes, FC } from 'react';

import './style.scss';

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  values?: { value: string; id: number }[];
  mode?: 'default' | 'btn';
  onClick?: () => void;
}

export const Select: FC<Props> = ({ values, onClick, mode = 'default', ...props }) =>
  mode === 'btn' ? (
    <button className="convert-select" onClick={onClick}>
      {props.value}
    </button>
  ) : (
    <select
      id="standard-select"
      className="convert-select"
      onClick={onClick}
      {...props}
    >
      {values?.map(({ value, id }) => (
        <option key={id} value={id}>
          {value}
        </option>
      ))}
    </select>
  );