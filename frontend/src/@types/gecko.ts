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
  included?: GeckoTokenIncluded | PoolGeckoType;
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
  address: string;
  base_token_price_usd: string;
  base_token_price_native_currency: string;
  quote_token_price_usd: string;
  quote_token_price_native_currency: string;
  base_token_price_quote_token: string;
  quote_token_price_base_token: string;
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

export interface GeckoTokenIncluded {
  attributes: {
    address: string;
    coingecko_coin_id: string;
    image_url: string;
    name: string;
    symbol: string;
  };
  id: string;
  type: string;
}

export interface GeckoTokenOverview {
  id: string;
  attributes: {
    address: string;
    coingecko_coin_id: string;
    decimals: number;
    fdv_usd: string;
    image_url: string;
    market_cap_usd: void;
    name: string;
    price_usd: string;
    symbol: string;
    total_reserve_in_usd: string;
    total_supply: string;
    volume_usd: {
      h24: string;
    };
    h24: string;
  };
}

export interface PoolGeckoType {
  id: string;
  type: string;
  attributes: PoolAttributes;
  relationships: PoolRelationships;
  included?: GeckoTokenIncluded;
  tokenOverview?: GeckoTokenOverview;
}

export interface OhlcvDataType {
  data: {
    id: string;
    type: string;
    attributes: {
      ohlcv_list: Array<number[]>;
    };
  };
}
