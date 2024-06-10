import { Tables } from '@/supabase/schema';

export const calculateShareImageData = (
  transactions: Tables<'transactions'>[],
  tokenPrice: number
) => {
  let profit = 0;
  let profitPercent = 0;

  const totalRevenueAll = transactions.reduce(
    (acc, cur) => {
      const date = new Date(cur.created_at).toLocaleDateString('en-US');

      if (cur.transaction_type === 'buy') {
        acc.buyVolume += cur.token_amount ?? 0;
        acc.buyAmountTotal += (cur.token_amount ?? 0) * (cur.token_price ?? 0);
        acc.buyDates.push(date);
      }

      if (cur.transaction_type === 'sell') {
        acc.sellVolume += cur.token_amount ?? 0;
        acc.sellAmountTotal += (cur.token_amount ?? 0) * (cur.token_price ?? 0);
        acc.sellDates.push(date);
      }

      return acc;
    },
    {
      buyVolume: 0,
      sellVolume: 0,
      buyAmountTotal: 0,
      sellAmountTotal: 0,
      buyDates: [] as string[],
      sellDates: [] as string[]
    }
  );

  if (totalRevenueAll.buyVolume >= totalRevenueAll.sellVolume) {
    const soldPrice =
      (totalRevenueAll.buyVolume - totalRevenueAll.sellVolume) * tokenPrice;
    profit =
      totalRevenueAll.sellAmountTotal +
      soldPrice -
      totalRevenueAll.buyAmountTotal;
    profitPercent = (profit / totalRevenueAll.buyAmountTotal) * 100;
  }

  const datePurchased =
    totalRevenueAll.buyDates[totalRevenueAll.buyDates.length - 1];

  const dateSold = totalRevenueAll.sellDates.length
    ? totalRevenueAll.sellDates[totalRevenueAll.sellDates.length - 1]
    : '-';

  return {
    profitPercent,
    totalCost: totalRevenueAll.buyAmountTotal,
    profit,
    datePurchased,
    dateSold
  };
};
