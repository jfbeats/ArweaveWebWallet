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
	metadata: Metadata<this>
	messageVerifier: any
	messageRunner: MessageRunner
	id: string
	uuid: string
	signTransaction?: (...args: any) => Promise<any>
	sign?: (data: ArrayBufferView, options: any) => Promise<ArrayBufferView>
	decrypt?: (data: ArrayBufferView, options: any) => Promise<ArrayBufferView>
	download?: () => Promise<any>
	destructor?: () => any
}

interface Account {
	metadata: AccountMetadata
	key?: string
	balance?: string
	queries: { [key: string]: any }
	destructor?: () => any
}

interface MessageRunner {
	getMethodMetadata: (method: string) => MethodMetadata | undefined
}



type AccountMetadata = {
	name: string
	icon: import('vue').FunctionalComponent<import('vue').SVGAttributes, {}>
}

type StaticMetadata = AccountMetadata & {
	isSupported: boolean
	isProviderFor: (wallet: import('@/functions/Wallets').WalletProxy) => boolean
	addImportData: (data: Partial<WalletDataInterface>) => Promise<void>
}

type MethodMetadata = {
	skip?: boolean
	unavailable?: boolean
	userIntent?: boolean
}

type Metadata <T> = StaticMetadata & {
	methods: { [keys in keyof T]?: MethodMetadata }
}



type QueryBlockFilter = { min?: number, max?: number }

type QueryTransactionOptions = Partial<{
	ids: string[]
	owner: string
	target: string
	tags: { [key: string]: string }
	block: QueryBlockFilter
	direction: 'up' | 'down'
}>

type QueryBlockOptions = QueryBlockFilter & Partial<{
	direction: 'up' | 'down'
}>