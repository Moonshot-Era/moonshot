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
