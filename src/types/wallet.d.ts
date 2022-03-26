type ProviderName = import('@/functions/Wallets').ProviderList
type WalletDataInterface = {
	id: string
	uuid?: string
	jwk?: import('arweave/web/lib/wallet').JWKInterface | EncryptedContent
	provider?: ProviderName
	data?: { [name in ProviderName]?: { key?: string } }
}

interface Provider extends Account {
	metadata: Metadata<this>
	messageVerifier: any
	messageRunner: MessageRunner
	signTransaction?: (...args: any) => Promise<any>
	bundle?: (...args: any) => Promise<any>
	sign?: (data: ArrayBufferView, options: any) => Promise<ArrayBufferView>
	decrypt?: (data: ArrayBufferView, options: any) => Promise<ArrayBufferView>
	download?: () => Promise<any>
	destructor?: () => any
}

interface Account {
	metadata: AccountMetadata
	key?: string
	balance?: string
	queries: { query: any, name: string, color: string }[]
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
	link?: string
	isSupported: boolean
	isProviderFor: (wallet: Partial<WalletDataInterface>) => boolean
	addImportData: (data: Partial<WalletDataInterface>) => Promise<void>
	verify?: () => any
}

type MethodMetadata = {
	skip?: boolean
	unavailable?: boolean
	userIntent?: boolean
}

type Metadata <T> = StaticMetadata & {
	methods: { [keys in keyof T]?: MethodMetadata }
}