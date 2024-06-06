import { Tables } from '@/supabase/schema';

export const calculateShareImageData = (
  transactions: Tables<'transactions'>[],
  tokenPrice: number
) => {
  const purchaseTransactions = transactions.filter(
    (item) => item.transaction_type === 'buy'
  );
  const sellTransactions = transactions.filter(
    (item) => item.transaction_type === 'sell'
  );

  const lastPurchaseTransaction =
    purchaseTransactions[purchaseTransactions.length - 1];
  const lastSellTransaction = sellTransactions[sellTransactions.length - 1];

  const totalCost = purchaseTransactions.reduce((acc, transaction) => {
    return (
      acc + (transaction.token_amount || 0) * (transaction.token_price || 0)
    );
  }, 0);

  let totalRevenue;

  if (!sellTransactions.length) {
    totalRevenue = purchaseTransactions.reduce((acc, transaction) => {
      console.log(
        'transaction.token_amount',
        transaction.token_amount,
        '*',
        tokenPrice
      );
      return acc + (transaction.token_amount || 0) * tokenPrice;
    }, 0);
  } else {
    totalRevenue = sellTransactions.reduce((acc, transaction) => {
      return (
        acc + (transaction.token_amount || 0) * (transaction.token_price || 0)
      );
    }, 0);
  }

  const profit = totalRevenue - totalCost;

  const profitPercent = (profit / totalCost) * 100;

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
