export interface TokenAttributes {
  address: string;
  name: string;
  symbol: string;
  image_url: string;
  coingecko_coin_id?: string;
  decimals: number;
  total_supply?: string;
  price_usd: string;
  fdv_usd?: string;
  total_reserve_in_usd?: string;
  volume_usd: {
    h24: string;
  };
  market_cap_usd?: string | null;
}

export interface TokenRelationships {
  top_pools: {
    data: RelationshipData[];
  };
}

export interface TokenItemGeckoType {
  id: string;
  type: string;
  attributes: TokenAttributes;
  relationships: TokenRelationships;
}

interface PriceChangePercentage {
  m5: string;
  h1: string;
  h6: string;
  h24: string;
}

interface TransactionDetails {
  buys: number;
  sells: number;
  buyers: number;
  sellers: number;
}

interface Transactions {
  m5: TransactionDetails;
  m15: TransactionDetails;
  m30: TransactionDetails;
  h1: TransactionDetails;
  h24: TransactionDetails;
}

interface VolumeUSD {
  m5: string;
  h1: string;
  h6: string;
  h24: string;
}

export interface PoolAttributes {
  base_token_price_usd: string;
  base_token_price_native_currency: string;
  quote_token_price_usd: string;
  quote_token_price_native_currency: string;
  base_token_price_quote_token: string;
  quote_token_price_base_token: string;
  address: string;
  name: string;
  pool_created_at: string;
  fdv_usd: string;
  market_cap_usd: string | null;
  price_change_percentage: PriceChangePercentage;
  transactions: Transactions;
  volume_usd: VolumeUSD;
  reserve_in_usd: string;
}

interface RelationshipData {
  id: string;
  type: string;
}

interface PoolRelationships {
  base_token: {
    data: RelationshipData;
  };
  quote_token: {
    data: RelationshipData;
  };
  dex: {
    data: RelationshipData;
  };
}

export interface PoolGeckoType {
  id: string;
  type: string;
  attributes: PoolAttributes;
  relationships: PoolRelationships;
}
