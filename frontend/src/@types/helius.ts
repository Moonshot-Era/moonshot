export interface TokenOverviewHeliusType {
  jsonrpc: string;
  result: {
    interface: string;
    id: string;
    content: {
      $schema: string;
      json_uri: string;
      files: Array<{
        uri: string;
        cdn_uri: string;
        mime: string;
      }>;
      metadata: {
        description: string;
        name: string;
        symbol: string;
        token_standard: string;
      };
      links: {
        image: string;
      };
    };
    authorities: Array<{
      address: string;
      scopes: string[];
    }>;
    compression: {
      eligible: boolean;
      compressed: boolean;
      data_hash: string;
      creator_hash: string;
      asset_hash: string;
      tree: string;
      seq: number;
      leaf_id: number;
    };
    grouping: any[];
    royalty: {
      royalty_model: string;
      target: any;
      percent: number;
      basis_points: number;
      primary_sale_happened: boolean;
      locked: boolean;
    };
    creators: any[];
    ownership: {
      frozen: boolean;
      delegated: boolean;
      delegate: any;
      ownership_model: string;
      owner: string;
    };
    supply: any;
    mutable: boolean;
    burnt: boolean;
    token_info: {
      supply: number;
      decimals: number;
      token_program: string;
    };
  };
  id: string;
}

interface Compression {
  eligible: boolean;
  compressed: boolean;
  data_hash: string;
  creator_hash: string;
  asset_hash: string;
  tree: string;
  seq: number;
  leaf_id: number;
}

interface Metadata {
  description: string;
  name: string;
  symbol: string;
  token_standard: string;
}

interface Links {
  image: string;
}

interface Content {
  $schema: string;
  json_uri: string;
  files: any[];
  metadata: Metadata;
  links: Links;
}

interface Authority {
  address: string;
  scopes: any[];
}

interface Ownership {
  frozen: boolean;
  delegated: boolean;
  delegate: string | null;
  ownership_model: string;
  owner: string;
}

interface Royalty {
  royalty_model: string;
  target: string | null;
  percent: number;
  basis_points: number;
  primary_sale_happened: boolean;
  locked: boolean;
}

interface PriceInfo {
  price_per_token: number;
  total_price: number;
  currency: string;
}

interface TokenInfo {
  symbol: string;
  balance: number;
  supply: number;
  decimals: number;
  token_program: string;
  associated_token_address: string;
  price_info: PriceInfo;
}

export interface TokenItemHeliusType {
  interface: string;
  id: string;
  content: Content;
  authorities: Authority[];
  compression: Compression;
  grouping: any[];
  royalty: Royalty;
  creators: any[];
  ownership: Ownership;
  supply: number | null;
  mutable: boolean;
  burnt: boolean;
  token_info: TokenInfo;
}

export interface WalletPortfolioType {
  items: TokenItemHeliusType[];
  totalUsd: number;
  wallet: string;
}

export interface TokenTransfer {
  fromUserAccount: string;
  fromTokenAccount: string;
  toUserAccount: string;
  toTokenAccount: string;
  tokenAmount: number;
  mint: string;
  tokenStandard: string;
}
export interface NativeTransfer {
  fromUserAccount: string;
  toUserAccount: string;
  amount: number;
}

interface AccountData {
  account: string;
  nativeBalanceChange: number;
  tokenBalanceChanges: {
    userAccount: string;
    tokenAccount: string;
    mint: string;
    rawTokenAmount: {
      tokenAmount: string;
    };
  }[];
}

interface InnerInstruction {
  accounts: string[];
  data: string;
  programId: string;
}

interface Instruction {
  accounts: string[];
  data: string;
  programId: string;
  innerInstructions: InnerInstruction[];
}

export interface Transaction {
  description: string;
  type: string;
  source: string;
  fee: number;
  feePayer: string;
  signature: string;
  slot: number;
  timestamp: number;
  tokenTransfers: TokenTransfer[];
  nativeTransfers: NativeTransfer[];
  accountData: AccountData[];
  transactionError: null | any;
  instructions: Instruction[];
}
