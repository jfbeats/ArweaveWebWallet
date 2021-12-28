// wallet - user owned data
// proxy - metadata, composition
// account - public id, txs
// provider - sign and decrypt data, decrypt and persist keyfiles



type ProviderName = keyof typeof import('@/functions/Wallets').ProviderRegistry
type WalletDataInterface = {
	id: number
	jwk?: import('arweave/web/lib/wallet').JWKInterface
	provider?: ProviderName
} & {
	[key in ProviderName]?: { [key: string]: any }
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

interface Account {
	key?: string
	balance?: string
	queries: { [key: string]: any[] }
	queriesStatus: { [key: string]: QueryStatusInterface }
	fetchTransactions: (query: Query) => Promise<any>
	updateTransactions: (query: Query) => Promise<any>
}

interface Provider {
	metadata: Metadata
	signTransaction?: (...args: any) => Promise<any>
	sign?: (data: ArrayBufferView, options: any) => Promise<ArrayBufferView>
	decrypt?: (data: ArrayBufferView, options: any) => Promise<ArrayBufferView>
	download?: () => Promise<any>
	verifyMessage: (message: Message | string) => boolean
	runMessage: (message: Message) => Promise<any>
}

interface WalletProxy extends Provider, Account {
	id: string
}