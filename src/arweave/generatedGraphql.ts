import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

/** Representation of a value transfer between wallets, in both winson and ar. */
export type Amount = {
  __typename?: 'Amount';
  /** Amount as an AR string e.g. \`"0.000000000001"\`. */
  ar: Scalars['String'];
  /** Amount as a winston string e.g. \`"1000000000000"\`. */
  winston: Scalars['String'];
};

export type Block = {
  __typename?: 'Block';
  /** The block height. */
  height: Scalars['Int'];
  /** The block ID. */
  id: Scalars['ID'];
  /** The previous block ID. */
  previous: Scalars['ID'];
  /** The block timestamp (UTC). */
  timestamp: Scalars['Int'];
};

/**
 * Paginated result set using the GraphQL cursor spec,
 * see: https://relay.dev/graphql/connections.htm.
 */
export type BlockConnection = {
  __typename?: 'BlockConnection';
  edges: Array<BlockEdge>;
  pageInfo: PageInfo;
};

/** Paginated result set using the GraphQL cursor spec. */
export type BlockEdge = {
  __typename?: 'BlockEdge';
  /**
   * The cursor value for fetching the next page.
   *
   * Pass this to the \`after\` parameter in \`blocks(after: $cursor)\`, the next page will start from the next item after this.
   */
  cursor: Scalars['String'];
  /** A block object. */
  node: Block;
};

/** Find blocks within a given range */
export type BlockFilter = {
  /** Maximum block height to filter to */
  max?: InputMaybe<Scalars['Int']>;
  /** Minimum block height to filter from */
  min?: InputMaybe<Scalars['Int']>;
};

/**
 * The data bundle containing the current data item.
 * See: https://github.com/ArweaveTeam/arweave-standards/blob/master/ans/ANS-104.md.
 */
export type Bundle = {
  __typename?: 'Bundle';
  /** ID of the containing data bundle. */
  id: Scalars['ID'];
};

/** Basic metadata about the transaction data payload. */
export type MetaData = {
  __typename?: 'MetaData';
  /** Size of the associated data in bytes. */
  size: Scalars['String'];
  /** Type is derrived from the \`content-type\` tag on a transaction. */
  type?: Maybe<Scalars['String']>;
};

/** Representation of a transaction owner. */
export type Owner = {
  __typename?: 'Owner';
  /** The owner's wallet address. */
  address: Scalars['String'];
  /** The owner's public key as a base64url encoded string. */
  key: Scalars['String'];
};

/** Paginated page info using the GraphQL cursor spec. */
export type PageInfo = {
  __typename?: 'PageInfo';
  hasNextPage: Scalars['Boolean'];
};

/**
 * The parent transaction for bundled transactions,
 * see: https://github.com/ArweaveTeam/arweave-standards/blob/master/ans/ANS-102.md.
 */
export type Parent = {
  __typename?: 'Parent';
  id: Scalars['ID'];
};

export type Query = {
  __typename?: 'Query';
  block?: Maybe<Block>;
  blocks: BlockConnection;
  /** Get a transaction by its id */
  transaction?: Maybe<Transaction>;
  /** Get a paginated set of matching transactions using filters. */
  transactions: TransactionConnection;
};


export type QueryBlockArgs = {
  id?: InputMaybe<Scalars['String']>;
};


export type QueryBlocksArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  height?: InputMaybe<BlockFilter>;
  ids?: InputMaybe<Array<Scalars['ID']>>;
  sort?: InputMaybe<SortOrder>;
};


export type QueryTransactionArgs = {
  id: Scalars['ID'];
};


export type QueryTransactionsArgs = {
  after?: InputMaybe<Scalars['String']>;
  block?: InputMaybe<BlockFilter>;
  bundledIn?: InputMaybe<Array<Scalars['ID']>>;
  first?: InputMaybe<Scalars['Int']>;
  ids?: InputMaybe<Array<Scalars['ID']>>;
  owners?: InputMaybe<Array<Scalars['String']>>;
  recipients?: InputMaybe<Array<Scalars['String']>>;
  sort?: InputMaybe<SortOrder>;
  tags?: InputMaybe<Array<TagFilter>>;
};

/** Optionally reverse the result sort order from `HEIGHT_DESC` (default) to `HEIGHT_ASC`. */
export enum SortOrder {
  /** Results are sorted by the transaction block height in ascending order, with the oldest transactions appearing first, and the most recent and pending/unconfirmed appearing last. */
  HeightAsc = 'HEIGHT_ASC',
  /** Results are sorted by the transaction block height in descending order, with the most recent and unconfirmed/pending transactions appearing first. */
  HeightDesc = 'HEIGHT_DESC'
}

export type Tag = {
  __typename?: 'Tag';
  /** UTF-8 tag name */
  name: Scalars['String'];
  /** UTF-8 tag value */
  value: Scalars['String'];
};

/** Find transactions with the folowing tag name and value */
export type TagFilter = {
  /** The tag name */
  name: Scalars['String'];
  /** The operator to apply to to the tag filter. Defaults to EQ (equal). */
  op?: InputMaybe<TagOperator>;
  /**
   * An array of values to match against. If multiple values are passed then transactions with _any_ matching tag value from the set will be returned.
   *
   * e.g.
   *
   * \`{name: "app-name", values: ["app-1"]}\`
   *
   * Returns all transactions where the \`app-name\` tag has a value of \`app-1\`.
   *
   * \`{name: "app-name", values: ["app-1", "app-2", "app-3"]}\`
   *
   * Returns all transactions where the \`app-name\` tag has a value of either \`app-1\` _or_ \`app-2\` _or_ \`app-3\`.
   */
  values: Array<Scalars['String']>;
};

/** The operator to apply to a tag value. */
export enum TagOperator {
  /** Equal */
  Eq = 'EQ',
  /** Not equal */
  Neq = 'NEQ'
}

export type Transaction = {
  __typename?: 'Transaction';
  anchor: Scalars['String'];
  /** Transactions with a null block are recent and unconfirmed, if they aren't mined into a block within 60 minutes they will be removed from results. */
  block?: Maybe<Block>;
  /**
   * For bundled data items this references the containing bundle ID.
   * See: https://github.com/ArweaveTeam/arweave-standards/blob/master/ans/ANS-104.md
   */
  bundledIn?: Maybe<Bundle>;
  data: MetaData;
  fee: Amount;
  id: Scalars['ID'];
  owner: Owner;
  /**
   * @deprecated Don't use, kept for backwards compatability only!
   * @deprecated Use `bundledIn`
   */
  parent?: Maybe<Parent>;
  quantity: Amount;
  recipient: Scalars['String'];
  signature: Scalars['String'];
  tags: Array<Tag>;
};

/**
 * Paginated result set using the GraphQL cursor spec,
 * see: https://relay.dev/graphql/connections.htm.
 */
export type TransactionConnection = {
  __typename?: 'TransactionConnection';
  edges: Array<TransactionEdge>;
  pageInfo: PageInfo;
};

/** Paginated result set using the GraphQL cursor spec. */
export type TransactionEdge = {
  __typename?: 'TransactionEdge';
  /**
   * The cursor value for fetching the next page.
   *
   * Pass this to the \`after\` parameter in \`transactions(after: $cursor)\`, the next page will start from the next item after this.
   */
  cursor: Scalars['String'];
  /** A transaction object. */
  node: Transaction;
};

export type GetBlocksQueryVariables = Exact<{
  ids?: InputMaybe<Array<Scalars['ID']> | Scalars['ID']>;
  height?: InputMaybe<BlockFilter>;
  first?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<SortOrder>;
}>;


export type GetBlocksQuery = { __typename?: 'Query', blocks: { __typename?: 'BlockConnection', pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean }, edges: Array<{ __typename?: 'BlockEdge', cursor: string, node: { __typename?: 'Block', id: string, timestamp: number, height: number, previous: string } }> } };

export type GetTransactionsQueryVariables = Exact<{
  ids?: InputMaybe<Array<Scalars['ID']> | Scalars['ID']>;
  owners?: InputMaybe<Array<Scalars['String']> | Scalars['String']>;
  recipients?: InputMaybe<Array<Scalars['String']> | Scalars['String']>;
  tags?: InputMaybe<Array<TagFilter> | TagFilter>;
  bundledIn?: InputMaybe<Array<Scalars['ID']> | Scalars['ID']>;
  block?: InputMaybe<BlockFilter>;
  first?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<SortOrder>;
}>;


export type GetTransactionsQuery = { __typename?: 'Query', transactions: { __typename?: 'TransactionConnection', pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean }, edges: Array<{ __typename?: 'TransactionEdge', cursor: string, node: { __typename?: 'Transaction', id: string, recipient: string, block?: { __typename?: 'Block', height: number, id: string, timestamp: number } | null, owner: { __typename?: 'Owner', address: string, key: string }, fee: { __typename?: 'Amount', winston: string, ar: string }, quantity: { __typename?: 'Amount', winston: string, ar: string }, tags: Array<{ __typename?: 'Tag', name: string, value: string }>, data: { __typename?: 'MetaData', size: string, type?: string | null }, bundledIn?: { __typename?: 'Bundle', id: string } | null } }> } };


export const GetBlocksDocument = gql`
    query getBlocks($ids: [ID!], $height: BlockFilter, $first: Int = 10, $after: String, $sort: SortOrder = HEIGHT_DESC) {
  blocks(ids: $ids, height: $height, first: $first, after: $after, sort: $sort) {
    pageInfo {
      hasNextPage
    }
    edges {
      cursor
      node {
        id
        timestamp
        height
        previous
      }
    }
  }
}
    `;
export const GetTransactionsDocument = gql`
    query getTransactions($ids: [ID!], $owners: [String!], $recipients: [String!], $tags: [TagFilter!], $bundledIn: [ID!], $block: BlockFilter, $first: Int = 10, $after: String, $sort: SortOrder = HEIGHT_DESC) {
  transactions(
    ids: $ids
    owners: $owners
    recipients: $recipients
    tags: $tags
    bundledIn: $bundledIn
    block: $block
    first: $first
    after: $after
    sort: $sort
  ) {
    pageInfo {
      hasNextPage
    }
    edges {
      cursor
      node {
        id
        block {
          height
          id
          timestamp
        }
        recipient
        owner {
          address
          key
        }
        fee {
          winston
          ar
        }
        quantity {
          winston
          ar
        }
        tags {
          name
          value
        }
        data {
          size
          type
        }
        bundledIn {
          id
        }
      }
    }
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    getBlocks(variables?: GetBlocksQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetBlocksQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetBlocksQuery>(GetBlocksDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getBlocks');
    },
    getTransactions(variables?: GetTransactionsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetTransactionsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetTransactionsQuery>(GetTransactionsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getTransactions');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;