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
	messageRunner: MessageRunner
	id: string
	uuid: string
	metadata: Metadata<any>
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

interface MessageRunner {
	getMethodMetadata: (method: string) => MethodMetadata | undefined
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

type MethodMetadata = {
	skip?: boolean
	unavailable?: boolean
	userIntent?: boolean
}

type Metadata <T> = {
	name: string
	icon: import('vue').Component
	isSupported: boolean
	methods?: { [keys in keyof T]?: MethodMetadata }
}

interface ProviderData extends Metadata<any> {
	getImportData: () => Promise<Omit<WalletDataInterface, 'id'>>
}