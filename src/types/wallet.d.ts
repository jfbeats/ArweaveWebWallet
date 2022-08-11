type ProviderId = import('@/functions/Wallets').ProviderId
type WalletDataInterface = {
	id: string
	uuid?: string
	jwk?: import('arweave/web/lib/wallet').JWKInterface | EncryptedContent
	provider?: ProviderId
	data?: { [name in ProviderId]?: { key?: string } }
	settings?: {
		sync?: boolean
		securityLevel?: 'always' | 'inactivity' | undefined
	}
}

type AnyProvider = import('@/functions/Wallets').AnyProvider
type Wallet = Union<InstanceType<AnyProvider>>

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
	name?: string
	icon?: import('vue').FunctionalComponent<import('vue').SVGAttributes, {}>
	color?: string
}

type ProviderMetadata = DisplayMetadata & {
	id: ProviderId
	disabled?: boolean
	isProviderFor?: (wallet: Partial<WalletDataInterface>) => boolean
	addPassphrase?: (passphrase: string) => Promise<Partial<WalletDataInterface>>
	addKeyfile?: (keyfile?: string) => Promise<Partial<WalletDataInterface>>
	addAddress?: (address: string) => Promise<Partial<WalletDataInterface>>
	addImportData: (data?: Partial<WalletDataInterface>, options?: ImportOptions) => Promise<Partial<WalletDataInterface>>
	actions?: Action[]
}

type InstanceMetadata<T> = ProviderMetadata & {
	methods: { [keys in keyof T]?: MethodMetadata }
}

type MethodMetadata = {
	skip?: boolean
	unavailable?: boolean
	userIntent?: boolean
}

type Action = DisplayMetadata & { // Todo type action in defineProps
	run?: Function
	to?: import('vue-router').RouteLocationRaw
}

type ImportOptions = Partial<{
	address: string
}>