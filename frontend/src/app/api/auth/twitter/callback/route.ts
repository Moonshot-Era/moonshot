import axios from 'axios';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { jwtDecode } from 'jwt-decode';

import { createServerClient } from '@/supabase/server';
import { ROUTES } from '@/utils';
import { storeCubeSignerSessionData } from '@/services';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  try {
    const code = searchParams.get('code') as string;
    const state = searchParams.get('state') as string;
    const [codeChallenge, cultureRef] = state.split('~~~');

    if (!code) {
      throw Error('code is missed');
    }

    const { data: twitterAuthResponse } = await axios.post(
      `${process.env.CUBE_SIGNER_URL}/v0/org/${encodeURIComponent(
        process.env.CUBE_SIGNER_ORG_ID
      )}/oauth2/twitter`,
      new URLSearchParams({
        code,
        grant_type: 'authorization_code',
        client_id: process.env.TWITTER_CLIENT_ID!,
        redirect_uri: process.env.TWITTER_AUTH_REDIRECT_URL,
        code_verifier: codeChallenge
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      }
    );

    if (!twitterAuthResponse.id_token) {
      throw new Error('id_token is missing');
    }

    const secret = process.env.PASSWORD_SECRET!;

    const decodedToken = jwtDecode<{ preferred_username: string }>(
      twitterAuthResponse.id_token
    );

    const email = decodedToken.preferred_username.includes('@')
      ? decodedToken.preferred_username
      : `${decodedToken.preferred_username}@x.moonshot.tech`;
    const password = crypto
      .createHmac('sha256', secret)
      .update(email + '~' + email)
      .digest('hex');

    const supabaseServerClient = createServerClient();

    const { error: signUpError } = await supabaseServerClient.auth.signUp({
      email,
      password,

      options: {
        data: {
          email,
          ...decodedToken,
          full_name: decodedToken.preferred_username
        }
      }
    });

    if (signUpError?.message) {
      if (signUpError?.message === 'User already registered') {
        const { error: signInError, data: userData } =
          await supabaseServerClient.auth.signInWithPassword({
            email,
            password
          });

        if (signInError) {
          throw signInError;
        }

        const { error: updateUserError } = await supabaseServerClient
          .from('profiles')
          .update({
            user_name: decodedToken.preferred_username
          })
          .eq('user_id', userData.user.id);
        if (updateUserError) {
          throw updateUserError;
        }
      } else {
        throw signUpError;
      }
    }

    if (cultureRef) {
      const { error: insertCultureRefError } = await supabaseServerClient.rpc(
        'insert_culture_ref',
        {
          culture_ref: cultureRef
        }
      );

      if (insertCultureRefError) {
        throw insertCultureRefError;
      }
    }

    await storeCubeSignerSessionData(twitterAuthResponse.id_token, email);

    return NextResponse.redirect(`${process.env.SITE_URL}`);
  } catch (err: any) {
    console.error('twitter/callback route ==> ', err);
    return NextResponse.redirect(`${process.env.SITE_URL}${ROUTES.login}`);
  }
}
