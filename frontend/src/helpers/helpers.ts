export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};

export const formatNumberToUsd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
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
