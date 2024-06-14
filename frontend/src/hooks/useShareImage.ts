import { calculateShareImageData } from '@/helpers/calculateShareImageData';
import { SupabaseClient } from '@supabase/supabase-js';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

export const useShareImage = (
  supabaseClient: SupabaseClient,
  tokenPrice: number
) => {
  const pathname = usePathname();
  const imageUrl = useRef<URL | null>();
  const [isLoading, setIsLoading] = useState(false);

  const generateImageSearchParams = useCallback(async () => {
    setIsLoading(true);
    const { data } = await supabaseClient.auth.getSession();
    const userId = data.session?.user?.id;

    const tokenAddress = pathname.replace('/culture/', '');

    const { data: transactions } = await supabaseClient
      .from('transactions')
      .select('*')
      .eq('user_id', userId || '')
      .eq('token_address', tokenAddress);

    if (transactions?.length) {
      imageUrl.current = new URL(
        '/proxy/functions/v1/og-image',
        process.env.NEXT_PUBLIC_SITE_URL
      );
      const { profit, profitPercent, datePurchased, dateSold, totalCost } =
        calculateShareImageData(transactions, tokenPrice);

      imageUrl.current.searchParams.append('name', transactions[0].token_name);
      imageUrl.current.searchParams.append(
        'profitPercent',
        profitPercent.toString()
      );
      imageUrl.current.searchParams.append('entry', totalCost.toString());
      imageUrl.current.searchParams.append('profit', profit.toFixed(2));
      imageUrl.current.searchParams.append('purchaseDate', datePurchased);
      imageUrl.current.searchParams.append('soldDate', dateSold);
    }
    setIsLoading(false);
  }, [pathname, supabaseClient, tokenPrice]);

  useEffect(() => {
    generateImageSearchParams();
  }, [generateImageSearchParams]);

  return { imageUrl: imageUrl.current, isLoading };
};
