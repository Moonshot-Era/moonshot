import React from 'react';
import './style.scss';

interface TokenNumberInputProps {
  decimalLimit: number;
  value: string;
  onChange: (value: string) => void;
}

export const TokenNumberInput: React.FC<TokenNumberInputProps> = ({ decimalLimit, value, onChange }) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const regex = new RegExp(`^\\d*(\\.\\d{0,${decimalLimit}})?$`);
    if (regex.test(value)) {
      onChange(value);
    }
  };

  return (
    <input 
      className="token-input" 
      type="text" 
      value={value} 
      onChange={handleInputChange} 
      placeholder="Enter amount"
    />
  );
};
