import { ArweaveAccount, ArweaveProvider } from '@/providers/Arweave'
import { LedgerProvider } from '@/providers/Ledger'
import { useChannel } from '@/functions/Channels'
import { useDataWrapper } from '@/functions/AsyncData'
import { generateMnemonic as generateM, validateMnemonic as validateM } from 'bip39-web-crypto'
import { notify } from '@/store/NotificationStore'
import { compact } from '@/functions/Utils'



const res = {
	english: () => import('bip39-web-crypto/src/wordlists/english.json')
} as const
type ResAwaited = { [key in keyof typeof res]: Awaited<ReturnType<typeof res[key]>> }
export async function getWordList <T extends keyof typeof res | undefined = undefined> (lang?: T) {
	const keys = (lang ? [lang] : Object.keys(res)) as [NonNullable<T>]
	const imports = await Promise.all(keys.map(async lang => ([lang, await res[lang]().then(i => i.default)] as const))).then(res => Object.fromEntries(res))
	const result = lang === undefined ? imports : imports[lang as string]
	return result as T extends keyof typeof res ? ResAwaited[T] : ResAwaited
}



export type ProviderId = 'arweave' | 'ledger'
export type AnyProvider = typeof providers[number]
export const accounts = [ArweaveAccount]
export const softwareProviders = [ArweaveProvider] as const
export const hardwareProviders = [LedgerProvider] as const
export const providers = [...hardwareProviders, ...softwareProviders] as const



function selectProvider (wallet: WalletDataInterface) {
	for (const provider of providers) { if (provider.metadata.id === wallet.provider) { return provider } }
	for (const provider of providers) { if (provider.metadata.isProviderFor?.(wallet)) { return provider } }
	return ArweaveProvider
}



export async function selectProviders (from: 'wallet' | 'keyfile', wallet: WalletDataInterface | string) {
	return compact(await Promise.all(softwareProviders.map(async provider => {
		try {
			const walletData: Partial<WalletDataInterface> | undefined = from === 'wallet' ? wallet as WalletDataInterface : await provider.metadata.addKeyfile?.(wallet as string)
			if (!walletData || !provider.metadata.isProviderFor?.(walletData)) { return }
			await provider?.metadata.addImportData(walletData!)
			return { provider, walletData }
		} catch (e) {}
	})))
}



export function isWalletData (wallet?: string) {
	try {
		const walletData = JSON.parse(wallet!) as Partial<WalletDataInterface>
		const providersId = providers.map(p => p.metadata.id)
		return walletData?.data && Object.keys(walletData.data).filter(key => providersId.includes(key as any)).length > 0
	} catch (e) {}
}



function walletFactory (wallet: WalletDataInterface): Wallet {
	const provider = selectProvider(wallet)
	return new provider(wallet) as Wallet
}
const WalletsData = useChannel('wallets', undefined, []).state
export const Wallets = useDataWrapper(WalletsData, (w) => w.id, walletFactory, wallet => wallet.destructor?.())



export function getWalletById (walletId?: any) {
	if (walletId == null) { return }
	return Wallets.value.find(wallet => wallet.id == walletId || wallet.uuid == walletId || wallet.key == walletId || Object.values(wallet.data).some(v => v.key == walletId || v.publicKey == walletId))
}

export function getAccountByAddress (address: string): Account {
	return Wallets.value.find(wallet => wallet.key == address) || new ArweaveAccount(address)
}

export async function generateMnemonic (language?: keyof typeof res) { return generateM(undefined, undefined, await getWordList(language ?? 'english')) }
export async function validateMnemonic (mnemonic: string) {
	const res = await Promise.all(Object.values(await getWordList()).map(list => validateM(mnemonic, list)))
	return res.some(r => r)
}



export async function addMnemonic (mnemonic: string, provider?: AnyProvider): Promise<WalletDataInterface> {
	provider ??= ArweaveProvider
	const walletData = await provider.metadata.addPassphrase?.(mnemonic)
	if (!walletData) { throw 'error' }
	await provider.metadata.addImportData(walletData)
	return addWalletData(walletData)
}

export async function addKeyfile (keyfile?: string, provider?: AnyProvider): Promise<WalletDataInterface> { // todo deduplicate
	let walletData: Partial<WalletDataInterface> | undefined
	if (keyfile == null) {
		provider ??= ArweaveProvider
		const newWalletData = await provider.metadata.addKeyfile?.(keyfile)
		walletData = await provider.metadata.addImportData(newWalletData)
	} else {
		const providers = await selectProviders('keyfile', keyfile)
		walletData = providers[0].walletData // todo merge
	}
	if (!walletData) { throw 'error' }
	return addWalletData(walletData)
}

export async function addAddress (address?: string, provider?: AnyProvider): Promise<WalletDataInterface> {
	provider ??= ArweaveProvider
	const walletData = await provider.metadata.addImportData({}, { address })
	if (!walletData) { throw 'error' }
	return addWalletData(walletData)
}

export async function addWalletData (walletData: Partial<WalletDataInterface>) {
	walletData.id ??= getNewId()
	const result = walletData as WalletDataInterface
	WalletsData.value.push(result)
	return result
}

export async function deleteWallet (wallet: WalletDataInterface) {
	if (!await notify.confirm('Delete the selected account?').promise) { return }
	Wallets.value = Wallets.value.filter(w => w.id !== wallet.id)
}

function getNewId () {
	let i = 0
	while (WalletsData.value.find(w => +w.id === i)) { i++ }
	return i + ''
}



export function getMethodMetadata(provider?: Wallet, runnerMethod?: string): MethodMetadata & MethodMetadataPermission {
	if (!provider || !runnerMethod) { return {} }
	const methodMetadataExtended = (provider.messageRunner.methodMap as any)[runnerMethod] as MethodMetadataExtended<Wallet>
	if (!methodMetadataExtended) { return {} }
	const methodsMetadata = provider.metadata?.methods
	const rec = (methods: MethodMetadataRecursive<Wallet>): MethodMetadata => {
		if (typeof methods === 'string') {
			const methodMetadata = (methodsMetadata as any)?.[methods]
			const methodDefinition = provider[methods]
			return methodMetadata ?? (methodDefinition ? {} : { unavailable: true })
		}
		if ('or' in methods) {
			return {
				skip: methods.or.some(m => rec(m).skip),
				unavailable: !methods.or.some(m => !rec(m).unavailable),
				userIntent: methods.or.some(m => rec(m).userIntent),
				public: methods.or.every(m => rec(m).public),
			}
		}
		if ('and' in methods) {
			return {
				skip: methods.and.some(m => rec(m).skip),
				unavailable: methods.and.some(m => rec(m).unavailable),
				userIntent: methods.and.some(m => rec(m).userIntent),
				public: methods.and.every(m => rec(m).public),
			}
		}
		return methods
	}
	if (typeof methodMetadataExtended === 'object' && 'permission' in methodMetadataExtended) {
		return { ...rec(methodMetadataExtended.metadata), ...methodMetadataExtended.permission }
	}
	return rec(methodMetadataExtended)
}