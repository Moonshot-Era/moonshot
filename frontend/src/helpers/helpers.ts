export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};

export const formatNumberToUsKeepDecimals = () =>
  new Intl.NumberFormat('en-US', {
    notation: 'standard',
    maximumFractionDigits: 9
  });

export const formatNumberToUsFormat = (decimals?: number) =>
  new Intl.NumberFormat('en-US', {
    notation: 'standard',
    maximumFractionDigits: decimals || 2
  });

export const formatNumberToUsd = (decimals?: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: decimals ?? 2
  });

export const formatCashNumber = (decimals?: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: decimals || 0
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

export const tokenAddressWithDots = (tokenAddress: string) => tokenAddress ?
  `${tokenAddress.slice(0, 5)}...
  ${tokenAddress.slice(
    tokenAddress.length - 5 > 0 ? tokenAddress.length - 5 : 0,
    tokenAddress.length
  )}` : null;

export const formatTokenPrice = (price: string) => {
  if (+price > 1) {
    return formatNumberToUsd().format(+price);
  }

  let formatted = price;

  let [integerPart, decimalPart] = formatted.split('.');
  if (decimalPart) {
    let nonZeroDecimals = decimalPart.replace(/^0+/, '').slice(0, 4);
    let zeroCount = decimalPart.indexOf(nonZeroDecimals);
    decimalPart = decimalPart.substring(0, zeroCount + nonZeroDecimals.length);
    if (decimalPart.indexOf(nonZeroDecimals) > 3) {
      decimalPart = `0{{${zeroCount}}}` + decimalPart.replace(/^0+/, '');
      formatted = integerPart + '.' + decimalPart;
    } else {
      formatted = integerPart + '.' + decimalPart;
    }
  }
  return '$' + formatted;
};
