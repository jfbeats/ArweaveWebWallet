// wallet - user owned data
// proxy - metadata, composition
// account - public id, txs
// provider - sign and decrypt data, decrypt and persist keyfiles



interface WalletDataInterface {
	id: number
	jwk?: JsonWebKey
	account?: { [protocol: string]: object }
	provider?: { [protocol: string]: object }
}

type Query = 'received' | 'sent' | 'all'
type QueryStatusInterface = {
	completed?: boolean
	fetch?: boolean
	update?: boolean
	cursor?: string // TODO
	promise?: Promise<import('ardb/lib/faces/gql').GQLEdgeTransactionInterface[]> // TODO
} & {
	[key in Query]?: import('ardb/lib/faces/gql').GQLEdgeTransactionInterface // TODO make it a tx id?
}

interface Account {
	key: string | null
	balance: string | null
	queries: { [key: string]: any[] }
	queriesStatus: { [key: string]: QueryStatusInterface }
	updateBalance: () => Promise<any>
	fetchTransactions: (query: Query) => Promise<any>
	updateTransactions: (query: Query) => Promise<any>
}

interface Provider {
	jwk?: JsonWebKey
	signTransaction: (...args: any) => Promise<any>
	sign?: (...args: any) => Promise<any>
	decrypt?: (...args: any) => Promise<any>
	download?: () => Promise<any>
}
