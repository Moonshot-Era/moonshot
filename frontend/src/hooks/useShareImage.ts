import { calculateShareImageData } from '@/helpers/calculateShareImageData';
import { SupabaseClient } from '@supabase/supabase-js';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect } from 'react';

export const useShareImage = (
  supabaseClient: SupabaseClient,
  tokenPrice: number
) => {
  const pathname = usePathname();

  const imageUrl = new URL(
    '/proxy/functions/v1/og-image',
    process.env.NEXT_PUBLIC_SITE_URL
  );

  const generateImageSearchParams = useCallback(async () => {
    const { data } = await supabaseClient.auth.getSession();
    const userId = data.session?.user?.id;

    const tokenAddress = pathname.replace('/culture/', '');

    const { data: transactions } = await supabaseClient
      .from('transactions')
      .select('*')
      .eq('user_id', userId || '')
      .eq('token_address', tokenAddress);

    if (transactions?.length) {
      const { profit, profitPercent, datePurchased, dateSold, totalCost } =
        calculateShareImageData(transactions, tokenPrice);

      imageUrl.searchParams.append('name', transactions[0].token_address);
      imageUrl.searchParams.append('profitPercent', profitPercent.toString());
      imageUrl.searchParams.append('entry', totalCost.toString());
      imageUrl.searchParams.append('profit', profit.toFixed(2));
      imageUrl.searchParams.append('purchaseDate', datePurchased);
      imageUrl.searchParams.append('soldDate', dateSold);
      console.log('imageUrl.href', imageUrl.href);
    }
  }, [
    imageUrl.href,
    imageUrl.searchParams,
    pathname,
    supabaseClient,
    tokenPrice
  ]);

  useEffect(() => {
    generateImageSearchParams();
  }, [generateImageSearchParams]);

  return { imageUrl };
};
