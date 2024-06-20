import { NextResponse } from 'next/server';

import { QUERY_PARAM_CULTURE_REF } from '@/utils';
import { randomString } from '@/utils/randomString';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cultureRef = searchParams.get(QUERY_PARAM_CULTURE_REF);

  const codeChallenge = randomString(43);
  const state = `${codeChallenge}~~~${cultureRef ?? ''}`;

  const params = new URLSearchParams({
    response_type: 'code',
    // client_id: process.env.TWITTER_CLIENT_ID,
    client_id: 'Q29sX3luNndHOUg4QWNGb05fa2I6MTpjaQ',
    scope: 'users.read follows.read tweet.read follows.write',
    state: state,
    code_challenge: codeChallenge,
    code_challenge_method: 'plain',
    redirect_uri: process.env.TWITTER_AUTH_REDIRECT_URL
  });

  return NextResponse.redirect(
    `https://twitter.com/i/oauth2/authorize?${params}`
  );
}
