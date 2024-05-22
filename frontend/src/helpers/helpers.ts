export const formatNumber = (num: number) => {
  let [integerPart, decimalPart] = num.toString().split('.');

  let formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  if (!decimalPart) {
    decimalPart = '00';
  }

  if (decimalPart.length === 1) {
    decimalPart = decimalPart + '0';
  }

  return {
    number: formattedIntegerPart + '.' + decimalPart,
    numbersArray: [formattedIntegerPart, '.' + decimalPart],
  };
};

export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};
