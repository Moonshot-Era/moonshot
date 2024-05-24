import { createServerClient } from '@/supabase/server';
import { QUERY_PARAM_CULTURE_REF, ROUTES } from './constants';
import { redirect } from 'next/navigation';

export const checkProtectedRoute = async (searchParams?: {
  [key: string]: string | string[] | undefined;
}) => {
  const supabaseClient = createServerClient();

  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  if (!user) {
    const cultureRef = searchParams
      ? searchParams[QUERY_PARAM_CULTURE_REF]
      : null;

    redirect(
      `${ROUTES.login}${
        cultureRef ? `?${QUERY_PARAM_CULTURE_REF}=${cultureRef}` : ''
      }`,
    );
  }

  return user;
};
