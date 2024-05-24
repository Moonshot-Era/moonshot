import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cultureRef = searchParams.get('culture_ref');

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${
    process.env.GOOGLE_AUTH_CLIENT_ID
  }&redirect_uri=${
    process.env.GOOGLE_AUTH_REDIRECT_URL
  }&response_type=code&scope=openid profile email&prompt=select_account&state=${
    cultureRef || ''
  }`;

  return NextResponse.redirect(googleAuthUrl);
}
