namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    SOLANA_RPC_PROVIDER: string;
    SITE_URL: string;
    NEXT_PUBLIC_SITE_URL: string;

    NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID: string;
    GOOGLE_AUTH_CLIENT_ID: string;
    GOOGLE_AUTH_SECRET: string;
    GOOGLE_AUTH_REDIRECT_URL: string;

    TWITTER_SECRET: string;
    TWITTER_API_KEY: string;
    TWITTER_CLIENT_ID: string;
    TWITTER_AUTH_REDIRECT_URL: string;

    GECKO_URL_API: string;
    GECKO_API_KEY: string;

    SHIFT4_URL: string;
    SHIFT4_API_KEY: string;

    NEXT_PUBLIC_PROGRESSIER_ID: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    NEXT_PUBLIC_SUPABASE_URL: string;

    CUBE_SIGNER_URL: string;
    CUBE_SIGNER_ORG_ID: string;

    PASSWORD_SECRET: string;
  }
}
