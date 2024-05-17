namespace NodeJS {
  interface ProcessEnv {
    GITHUB_AUTH_TOKEN: string;
    NODE_ENV: 'development' | 'production' | 'test';
    SOLANA_RPC_PROVIDER: string;
    SITE_URL: string;
    NEXT_PUBLIC_SITE_URL: string;
  }
}
