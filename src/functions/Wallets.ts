import { ArweaveProvider, arweave, ArweaveAccount } from '@/store/ArweaveStore'
import { LedgerProvider } from '@/providers/Ledger'
import { ChannelRef } from '@/functions/Channels'
import { useDataWrapper } from '@/functions/AsyncData'
import { pkcs8ToJwk } from '@/functions/Crypto'
import { download } from '@/functions/Utils'
import { generateMnemonic as generateM, validateMnemonic as validateM } from 'bip39-web-crypto'
// @ts-ignore
import { getKeyPairFromMnemonic } from 'human-crypto-keys'
// @ts-ignore
import wordlist from 'bip39-web-crypto/src/wordlists/english.json'
import type { JWKInterface } from 'arweave/web/lib/wallet'
import type { Wallet } from '@/providers/WalletProxy'



export type ProviderList = 'arweave' | 'ledger'
export const ProviderRegistry: { [key in ProviderList]: any } = {
	arweave: ArweaveProvider,
	ledger: LedgerProvider,
} as const



function selectProvider (wallet: WalletDataInterface) {
	if (wallet.provider && ProviderRegistry[wallet.provider]) { return ProviderRegistry[wallet.provider] }
	for (const provider of Object.values(ProviderRegistry)) { if (provider.metadata.isProviderFor?.(wallet)) { return provider } }
	return ProviderRegistry['arweave']
}



function walletFactory (wallet: WalletDataInterface): Wallet {
	const provider = selectProvider(wallet)
	return new provider(wallet)
}
const WalletsData = new ChannelRef('wallets', undefined, []).state
export const Wallets = useDataWrapper(WalletsData, 'id', walletFactory, wallet => wallet.destructor?.())



export function getWalletById (walletId?: any) {
	return Wallets.value.find(wallet => wallet.id == walletId)
}

export function getAccountByAddress (address: string): Account {
	return Wallets.value.find(wallet => wallet.key == address)
		|| new ArweaveAccount(address)
}

export async function generateMnemonic () {
	return generateM(undefined, undefined, wordlist)
}

export async function validateMnemonic (mnemonic: string) {
	return validateM(mnemonic, wordlist)
}

export async function addMnemonic (mnemonic: string) {
	let keyPair = await getKeyPairFromMnemonic(mnemonic, { id: 'rsa', modulusLength: 4096 }, { privateKeyFormat: 'pkcs8-der' })
	const jwk = await pkcs8ToJwk(keyPair.privateKey)
	console.info('generated wallet')
	return addWallet(jwk as JWKInterface)
}

export async function addWallet (jwkObj: JWKInterface) {
	const jwk = jwkObj || await arweave.wallets.generate()
	const jwkString = JSON.stringify(jwk)
	const existing = WalletsData.value.find(w => JSON.stringify(w.jwk) === jwkString)
	if (existing) { return existing.id }
	const key = await arweave.wallets.jwkToAddress(jwk) as string
	if (!jwkObj) { download(key, jwkString) }
	const wallet = { id: getNewId(), jwk }
	WalletsData.value.push(wallet)
	return wallet.id
}

export async function addAddress (addressSource: any) {
	let key = typeof addressSource === 'string' && addressSource
	key ||= addressSource.key
	key ||= await addressSource.getActiveAddress?.()
	if (!key) { return }
	const wallet = { id: getNewId(), arweave: { key } }
	WalletsData.value.push(wallet)
	return wallet.id
}

export async function addProvider (provider: Provider) {
	const walletData = { id: getNewId() } // todo same but with jwk for arweave provider
	await provider.metadata.addImportData(walletData)
	WalletsData.value.push(walletData) // todo if not already present
	return walletData.id
}

export function deleteWallet (wallet: WalletDataInterface) {
	Wallets.value = Wallets.value.filter(w => w.id !== wallet.id)
}

function getNewId () {
	let i = 0
	while (WalletsData.value.find(w => +w.id === i)) { i++ }
	return i + ''
}