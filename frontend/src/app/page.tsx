import { redirect } from 'next/navigation';
import { createServerClient } from '@/supabase/server';

import { HomeContent } from '@/components/HomeContent/HomeContent';
import { Header } from '@/components/Header/Header';
import { SplashScreen } from '@/components/SplashScreen/SplashScreen';

export default async function Index() {
  const supabaseClient = createServerClient();

  const user = (await supabaseClient.auth.getSession()).data.session?.user;

  if (!user) {
    redirect('/login');
  }

  return (
    <>
      <Header />
      <SplashScreen />
      <HomeContent />;
    </>
  );
}
