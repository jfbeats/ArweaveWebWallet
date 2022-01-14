type ProviderName = keyof typeof import('@/functions/Wallets').ProviderRegistry
type WalletDataInterface = {
	id: string
	uuid?: string
	jwk?: import('arweave/web/lib/wallet').JWKInterface
	provider?: ProviderName
} & {
	[name in ProviderName]?: { key?: string }
}

interface Provider extends Account {
	messageVerifier: any
	messageRunner?: any
	id: string
	uuid: string
	metadata: Metadata
	signTransaction?: (...args: any) => Promise<any>
	sign?: (data: ArrayBufferView, options: any) => Promise<ArrayBufferView>
	decrypt?: (data: ArrayBufferView, options: any) => Promise<ArrayBufferView>
	download?: () => Promise<any>
	destructor?: () => any
}

interface Account {
	key?: string
	balance?: string
	queries: { [key: string]: any[] }
	queriesStatus: { [key: string]: QueryStatusInterface }
	fetchTransactions: (query: Query) => Promise<any>
	updateTransactions: (query: Query) => Promise<any>
	destructor?: () => any
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

type Metadata = {
	name: string
	icon: import('vue').Component
	isSupported: boolean
}

interface ProviderData extends Metadata {
	getImportData: () => Promise<Omit<WalletDataInterface, 'id'>>
}