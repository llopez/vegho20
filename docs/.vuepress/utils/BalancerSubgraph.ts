import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
  gql,
} from '@apollo/client/core/index';

export type TokenType = {
  name: string;
  symbol: string;
  decimals: string;
};

export type PoolType = {
  id: string;
  symbol: string;
  address: string;
  tokens: TokenType[];
};

export class BalancerSubgraph {
  public client: ApolloClient<NormalizedCacheObject>;

  constructor(uri: string) {
    this.client = new ApolloClient({
      uri,
      cache: new InMemoryCache(),
    });
  }

  public async getPools(): Promise<PoolType[]> {
    const query = gql(`
      query GetPoolsQuery {
        pools {
          id
          name
          symbol
          address
          tokens {
            name
            symbol
            decimals
          }
        }
      }
    `);

    const {
      data: { pools },
    } = await this.client.query({ query });

    return pools;
  }
}
