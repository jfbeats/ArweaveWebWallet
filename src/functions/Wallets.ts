import { ArweaveAccount, ArweaveProvider } from '@/providers/Arweave'
import { LedgerProvider } from '@/providers/Ledger'
import { useChannel } from '@/functions/Channels'
import { useDataWrapper } from '@/functions/AsyncData'
import { generateMnemonic as generateM, validateMnemonic as validateM } from 'bip39-web-crypto'
// @ts-ignore
import { getKeyPairFromMnemonic } from 'human-crypto-keys'
// @ts-ignore
import wordlist from 'bip39-web-crypto/src/wordlists/english.json'



export type ProviderId = 'arweave' | 'ledger'
export type AnyProvider = typeof providers[number]
export const softwareProviders = [ArweaveProvider] as const
export const hardwareProviders = [LedgerProvider] as const
export const providers = [...hardwareProviders, ...softwareProviders] as const



function selectProvider (wallet: WalletDataInterface) {
	for (const provider of providers) { if (provider.metadata.id === wallet.provider) { return provider } }
	for (const provider of providers) { if (provider.metadata.isProviderFor?.(wallet)) { return provider } }
	return ArweaveProvider
}



export async function selectProviders (from: 'wallet' | 'keyfile', wallet: WalletDataInterface | string) {
	return (await Promise.all(softwareProviders.map(async provider => {
		try {
			const walletData: Partial<WalletDataInterface> | undefined = from === 'wallet' ? wallet as WalletDataInterface : await provider.metadata.addKeyfile?.(wallet as string)
			if (!walletData || !provider.metadata.isProviderFor?.(walletData)) { return }
			await provider?.metadata.addImportData(walletData!)
			return { provider, walletData }
		} catch (e) {}
	}))).filter((res): res is NonNullable<typeof res> => !!res)
}



function walletFactory (wallet: WalletDataInterface): Wallet {
	const provider = selectProvider(wallet)
	return new provider(wallet) as Wallet
}
const WalletsData = useChannel('wallets', undefined, []).state
export const Wallets = useDataWrapper(WalletsData, (w) => w.id, walletFactory, wallet => wallet.destructor?.())



export function getWalletById (walletId?: any) {
	return Wallets.value.find(wallet => wallet.id == walletId)
}

export function getAccountByAddress (address: string): Account {
	return Wallets.value.find(wallet => wallet.key == address) || new ArweaveAccount(address)
}

export async function generateMnemonic () { return generateM(undefined, undefined, wordlist) }
export async function validateMnemonic (mnemonic: string) { return validateM(mnemonic, wordlist) }

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

async function addWalletData (walletData: Partial<WalletDataInterface>) {
	walletData.id ??= getNewId()
	const result = walletData as WalletDataInterface
	WalletsData.value.push(result)
	return result
}

export function deleteWallet (wallet: WalletDataInterface) {
	Wallets.value = Wallets.value.filter(w => w.id !== wallet.id)
}

function getNewId () {
	let i = 0
	while (WalletsData.value.find(w => +w.id === i)) { i++ }
	return i + ''
}



export function getMethodMetadata(provider?: Wallet, runnerMethod?: string): MethodMetadata {
	if (!provider || !runnerMethod) { return {} }
	const providerMethod = (provider.messageRunner.methodMap as any)[runnerMethod]
	if (!providerMethod) { return {} }
	const methodsMetadata = provider.metadata?.methods
	const result = methodsMetadata?.[providerMethod as keyof typeof methodsMetadata]
	if (!result && provider[providerMethod as keyof typeof methodsMetadata]) { return {} }
	return result || { unavailable: true }
}