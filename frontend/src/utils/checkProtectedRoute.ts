import { createServerClient } from '@/supabase/server';
import { QUERY_PARAM_CULTURE_REF, ROUTES } from './constants';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export const checkProtectedRoute = async (
  searchParams?: {
    [key: string]: string | string[] | undefined;
  },
  forceRedirect: boolean = true
) => {
  const supabaseClient = createServerClient();
  const header = headers();
  const pathname = header.get('x-pathname');

  const {
    data: { user }
  } = await supabaseClient.auth.getUser();

  if (!user && pathname?.includes('culture')) {
    return null;
  }

  if (!user) {
    const cultureRef = searchParams
      ? searchParams[QUERY_PARAM_CULTURE_REF]
      : null;

    redirect(
      `${ROUTES.login}${
        cultureRef ? `?${QUERY_PARAM_CULTURE_REF}=${cultureRef}` : ''
      }`
    );
  }

  const { data } = await supabaseClient
    .from('profiles')
    .select('onboarding_completed')
    .eq('user_id', user.id)
    .maybeSingle();

  if (
    forceRedirect &&
    !pathname?.startsWith(ROUTES.onboarding) &&
    !data?.onboarding_completed
  ) {
    redirect(ROUTES.onboarding);
  }

  return user;
};
