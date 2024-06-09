export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};

export const formatNumberToUsFormat = (decimals?: number) =>
  new Intl.NumberFormat('en-US', {
    notation: 'standard',
    maximumFractionDigits: decimals || 2,
  });

export const formatNumberToUsd = (decimals?: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: decimals || 2,
  });

export const formatCashNumber = (decimals?: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: decimals || 0,
  });

export const formatNumber = new Intl.NumberFormat('en-US');

export const isSolanaAddress = (address: string) => {
  if (
    address === 'So11111111111111111111111111111111111111111' ||
    address === 'So11111111111111111111111111111111111111112'
  ) {
    return 'So11111111111111111111111111111111111111112';
  }
  return false;
};

export const tokenAddressWithDots = (tokenAddress: string) =>
  `${tokenAddress.slice(0, 5)}...
  ${tokenAddress.slice(
    tokenAddress.length - 5 > 0 ? tokenAddress.length - 5 : 0,
    tokenAddress.length
  )}`;
