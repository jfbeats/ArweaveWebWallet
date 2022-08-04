import { arweave } from '@/store/ArweaveStore'
import { ArweaveAccount, ArweaveProvider } from '@/providers/Arweave'
import { LedgerProvider } from '@/providers/Ledger'
import { useChannel } from '@/functions/Channels'
import { useDataWrapper } from '@/functions/AsyncData'
import { pkcs8ToJwk } from '@/functions/Crypto'
import { download } from '@/functions/File'
import { generateMnemonic as generateM, validateMnemonic as validateM } from 'bip39-web-crypto'
// @ts-ignore
import { getKeyPairFromMnemonic } from 'human-crypto-keys'
// @ts-ignore
import wordlist from 'bip39-web-crypto/src/wordlists/english.json'
import type { JWKInterface } from 'arweave/web/lib/wallet'



export type ProviderList = 'arweave' | 'ledger'
export type AnyProvider = Union<InstanceType<typeof providers[number]>>
export const softwareProviders = [ArweaveProvider] as const
export const hardwareProviders = [LedgerProvider] as const
export const providers = [...hardwareProviders, ...softwareProviders] as const



function selectProvider (wallet: WalletDataInterface) {
	for (const provider of providers) { if (provider.metadata.id === wallet.provider) { return provider } }
	for (const provider of providers) { if (provider.metadata.isProviderFor?.(wallet)) { return provider } }
	return ArweaveProvider
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

export async function addMnemonic (mnemonic: string): Promise<WalletDataInterface> {
	let keyPair = await getKeyPairFromMnemonic(mnemonic, { id: 'rsa', modulusLength: 4096 }, { privateKeyFormat: 'pkcs8-der' })
	const jwk = await pkcs8ToJwk(keyPair.privateKey)
	console.info('generated wallet')
	return addWallet(jwk as JWKInterface)
}

export async function addWallet (jwkObj: JWKInterface): Promise<WalletDataInterface> { // todo use addProvider(ArweaveProvider) instead, gen jwk when missing
	const jwk = jwkObj || await arweave.wallets.generate()
	const jwkString = JSON.stringify(jwk)
	const existing = WalletsData.value.find(w => JSON.stringify(w.jwk) === jwkString)
	if (existing) { return existing }
	const key = await arweave.wallets.jwkToAddress(jwk) as string
	if (!jwkObj) { download(key, jwkString) }
	const walletData: WalletDataInterface = { id: getNewId(), jwk }
	WalletsData.value.push(walletData)
	return walletData
}

export async function addAddress (addressSource: any): Promise<WalletDataInterface> { // todo make provider specific
	let key = typeof addressSource === 'string' && addressSource
	key ||= addressSource.key
	key ||= await addressSource.getActiveAddress?.()
	if (!key) { throw 'no address found' }
	const walletData: WalletDataInterface = { id: getNewId(), data: { arweave: { key } } }
	WalletsData.value.push(walletData)
	return walletData
}

export async function addProvider (provider: Provider): Promise<WalletDataInterface> { // todo deduplicate
	const walletData: WalletDataInterface = { id: getNewId() }
	await provider.metadata.addImportData(walletData)
	WalletsData.value.push(walletData)
	return walletData
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