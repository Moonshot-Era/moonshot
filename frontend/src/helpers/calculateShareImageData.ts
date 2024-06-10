import { Tables } from '@/supabase/schema';

export const calculateShareImageData = (
  transactions: Tables<'transactions'>[],
  tokenPrice: number
) => {
  let totalRevenueAmount = 0;
  let totalRevenuePercent = 0;

  const totalRevenueAll = transactions.reduce(
    (acc, cur) => {
      if (cur.transaction_type === 'buy') {
        acc.buyVolume += cur.token_amount ?? 0;
        acc.buyAmountTotal += (cur.token_amount ?? 0) * (cur.token_price ?? 0);
      }

      if (cur.transaction_type === 'sell') {
        acc.sellVolume += cur.token_amount ?? 0;
        acc.sellAmountTotal += (cur.token_amount ?? 0) * (cur.token_price ?? 0);
      }

      return acc;
    },
    { buyVolume: 0, sellVolume: 0, buyAmountTotal: 0, sellAmountTotal: 0 }
  );

  if (totalRevenueAll.buyVolume > totalRevenueAll.sellVolume) {
    totalRevenueAmount =
      totalRevenueAll.sellAmountTotal +
      (totalRevenueAll.buyVolume - totalRevenueAll.sellVolume) * tokenPrice -
      totalRevenueAll.buyAmountTotal;
    totalRevenuePercent =
      (totalRevenueAmount / totalRevenueAll.buyAmountTotal) * 100;
  }

  // const purchaseTransactions = transactions.filter(
  //   (item) => item.transaction_type === 'buy'
  // );
  // const sellTransactions = transactions.filter(
  //   (item) => item.transaction_type === 'sell'
  // );

  // const lastPurchaseTransaction =
  //   purchaseTransactions[purchaseTransactions.length - 1];
  // const lastSellTransaction = sellTransactions[sellTransactions.length - 1];

  // const totalCost = purchaseTransactions.reduce((acc, transaction) => {
  //   return (
  //     acc + (transaction.token_amount || 0) * (transaction.token_price || 0)
  //   );
  // }, 0);

  // if (!sellTransactions.length) {
  //   totalRevenue = purchaseTransactions.reduce((acc, transaction) => {
  //     console.log(
  //       'transaction.token_amount',
  //       transaction.token_amount,
  //       '*',
  //       tokenPrice
  //     );
  //     return acc + (transaction.token_amount || 0) * tokenPrice;
  //   }, 0);
  // } else {
  //   totalRevenue = sellTransactions.reduce((acc, transaction) => {
  //     return (
  //       acc + (transaction.token_amount || 0) * (transaction.token_price || 0)
  //     );
  //   }, 0);
  // }

  const profit = totalRevenueAmount;

  const profitPercent = totalRevenuePercent;

  const datePurchased = new Date(
    lastPurchaseTransaction.created_at || ''
  ).toLocaleDateString('en-US');
  const dateSold = lastSellTransaction
    ? new Date(lastSellTransaction.created_at).toLocaleDateString('en-US')
    : '-';

  return {
    profitPercent,
    totalCost,
    profit,
    datePurchased,
    dateSold
  };
};
