type ProviderName = import('@/functions/Wallets').ProviderList
type WalletDataInterface = {
	id: string
	uuid?: string
	jwk?: import('arweave/web/lib/wallet').JWKInterface | EncryptedContent
	provider?: ProviderName
	data?: { [name in ProviderName]?: { key?: string } }
	settings?: {
		sync?: boolean
		securityLevel?: 'always' | 'inactivity' | undefined
	}
}

interface Provider extends Account {
	metadata: Metadata<this>
	messageVerifier: any
	messageRunner: MessageRunner<this>
	signTransaction?: (...args: any) => Promise<any>
	bundle?: (...args: any) => Promise<any>
	sign?: (data: ArrayBufferView, options: any) => Promise<ArrayBufferView>
	decrypt?: (data: ArrayBufferView, options: any) => Promise<ArrayBufferView>
	download?: () => Promise<any>
	destructor?: () => any
}

interface Account {
	metadata: DisplayMetadata
	key?: string
	balance?: string
	queries: { query: any, name: string, color: string }[]
	destructor?: () => any
}

interface MessageRunner<T> {
	get methodMap(): MethodMap<this, T>
}



type DisplayMetadata = {
	name: string
	icon: import('vue').FunctionalComponent<import('vue').SVGAttributes, {}>
	color?: string
}

type ProviderMetadata = DisplayMetadata & {
	id: string
	link?: string
	disabled?: boolean
	addImportData: (data: Partial<WalletDataInterface>) => Promise<void>
	isProviderFor?: (wallet: Partial<WalletDataInterface>) => boolean
	verify?: () => any // todo change to actions
}

type Metadata <T> = ProviderMetadata & {
	methods: { [keys in keyof T]?: MethodMetadata }
}

type MethodMetadata = {
	skip?: boolean
	unavailable?: boolean
	userIntent?: boolean
}

type MethodMap <T, U> = { [keys in keyof T]?: keyof U}