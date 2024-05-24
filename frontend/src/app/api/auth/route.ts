import { NextResponse } from 'next/server';
// import { supabase } from '../../../../lib/supabaseClient';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'Missing code' }, { status: 400 });
  }

  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_AUTH_CLIENT_ID!,
        client_secret: process.env.GOOGLE_AUTH_SECRET!,
        redirect_uri: process.env.GOOGLE_AUTH_REDIRECT_URL!,
        grant_type: 'authorization_code',
      }),
    });

    const data = await response.json();
    const accessToken = data.access_token;
    console.log('debug > accessToken===', accessToken);

    // Set the token in Supabase
    // await supabase.auth.setAuth(accessToken);

    // Redirect to the home page or user profile
    return NextResponse.redirect('/');
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
