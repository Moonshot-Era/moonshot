import { createServerClient } from '@/supabase/server';

export const getTransactionsHistoryDB = async () => {
  const supabaseServerClient = createServerClient();

  const { data, error } = await supabaseServerClient.auth.getUser();
  const userId = data?.user?.id;

  const { data: transactions, error: transactionsError } =
    await supabaseServerClient
      .from('transactions')
      .select('*')
      .eq('user_id', userId || '');

  if (error || transactionsError) {
    throw error || transactionsError;
  }
  return transactions;
};
