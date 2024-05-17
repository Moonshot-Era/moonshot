import { getUserWallet } from '@/services';
import { createServerClient } from '@/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const formData = await request.formData();

  const credential = formData.get('credential') as string;
  const supabaseClient = createServerClient();
  await supabaseClient.auth.signInWithIdToken({
    provider: 'google',
    token: credential,
  });

  await getUserWallet(credential as string);
  cookies().set('gc', credential);

  return NextResponse.redirect(process.env.SITE_URL as string);
}
