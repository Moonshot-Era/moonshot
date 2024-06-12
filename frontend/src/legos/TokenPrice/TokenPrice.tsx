import { formatTokenPrice } from '@/helpers/helpers';

import './style.scss';

export const TokenPrice = ({ price }: { price: string }) => {
  if (+price > 1) {
    return <>{formatTokenPrice(price)}</>;
  }

  const formattedTokenPrice = formatTokenPrice(price);
  if (formattedTokenPrice.includes('{{')) {
    const leftPart = formattedTokenPrice.split('{{')?.[0];
    const rightPart = formattedTokenPrice.split('}}')?.[1];
    return (
      <>
        {leftPart}
        <span className="zero-count">
          {formattedTokenPrice.split('{{')?.[1]?.slice(0, 1)}
        </span>
        {rightPart}
      </>
    );
  }
  return <>{formattedTokenPrice}</>;
};
