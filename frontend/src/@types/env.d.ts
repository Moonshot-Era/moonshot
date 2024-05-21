namespace NodeJS {
  interface ProcessEnv {
    GITHUB_AUTH_TOKEN: string;
    NODE_ENV: 'development' | 'production' | 'test';
    SOLANA_RPC_PROVIDER: string;
    SITE_URL: string;
    NEXT_PUBLIC_SITE_URL: string;
    BIRDEYE_URL_API: string;
    BIRDEYE_X_API_KEY: string;
  }
}
