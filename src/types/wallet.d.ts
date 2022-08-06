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

type Wallet = import('@/functions/Wallets').AnyProvider

interface Provider extends Account {
	metadata: InstanceMetadata<this>
	messageVerifier: any
	messageRunner: MessageRunner<{}, this>
	signTransaction?: (...args: any) => Promise<any>
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

type ExternalAPI = { [key: string]: (...args: any) => any }

type MessageRunner<API extends ExternalAPI, Parent> = {
	get methodMap(): { [key in keyof API]?: keyof Parent }
} & {
	[key in keyof API]: (...args: Parameters<API[key]>) => ReturnType<API[key]>
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

type InstanceMetadata<T> = ProviderMetadata & {
	methods: { [keys in keyof T]?: MethodMetadata }
}

type MethodMetadata = {
	skip?: boolean
	unavailable?: boolean
	userIntent?: boolean
}