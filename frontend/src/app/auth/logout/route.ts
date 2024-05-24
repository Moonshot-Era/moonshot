import { createServerClient } from '@/supabase/server';
import { COOKIE_PROVIDER_TOKEN } from '@/utils';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const supabaseClient = createServerClient();
  await supabaseClient.auth.signOut();

  cookies().delete(COOKIE_PROVIDER_TOKEN);

  return NextResponse.json(null);
}
