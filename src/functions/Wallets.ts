import { ArweaveProvider, arweave, ArweaveAccount } from '@/store/ArweaveStore'
import { LedgerProvider } from '@/providers/Ledger'
import { ChannelRef } from '@/functions/Channels'
import { useDataWrapper } from '@/functions/AsyncData'
import { passwordEncrypt, passwordDecrypt, pkcs8ToJwk } from '@/functions/Crypto'
import { uuidV4, download } from '@/functions/Utils'
import { generateMnemonic as generateM, validateMnemonic as validateM } from 'bip39-web-crypto'
// @ts-ignore
import { getKeyPairFromMnemonic } from 'human-crypto-keys'
// @ts-ignore
import wordlist from 'bip39-web-crypto/src/wordlists/english.json'
import type { JWKInterface } from 'arweave/web/lib/wallet'



export const ProviderRegistry = {
	arweave: ArweaveProvider,
	ledger: LedgerProvider,
}



function selectProvider (wallet: WalletProxy) {
	if (wallet.data.provider && ProviderRegistry[wallet.data.provider]) { return ProviderRegistry[wallet.data.provider] }
	for (const provider of Object.values(ProviderRegistry)) { if (provider.isProviderFor?.(wallet)) { return provider } }
	return ProviderRegistry['arweave']
}



export class WalletProxy {
	#wallet: WalletDataInterface
	constructor (...args: any[]) {
		const walletData = args[0] as WalletDataInterface
		if (!walletData.uuid) { walletData.uuid = uuidV4() }
		if (!walletData.jwk) {
			const disabled = ['getPrivateKey'] as const
			disabled.forEach(method => this[method] = undefined)
		}
		this.#wallet = walletData
	}
	get data () { return this.#wallet }
	get id () { return this.#wallet.id + '' }
	get uuid () { return this.#wallet.uuid! }
	async getPrivateKey? (decrypt?: boolean): Promise<JWKInterface> {
		return this.#wallet.jwk!
	}
}



function walletFactory (wallet: WalletDataInterface): Provider {
	const walletProxy = new WalletProxy(wallet)
	const provider = selectProvider(walletProxy)
	return new provider(walletProxy)
}
const WalletsData = new ChannelRef('wallets', undefined, []).state
export const Wallets = useDataWrapper(WalletsData, 'id', walletFactory, (wallet) => { wallet.destructor?.() })



export function getWalletById (walletId?: number | string) {
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

export async function addProvider (provider: ProviderData) {
	const importData = await provider.getImportData()
	const wallet = { id: getNewId(), ...importData }
	WalletsData.value.push(wallet)
	return wallet.id
}

export function deleteWallet (wallet: WalletDataInterface) {
	Wallets.value = Wallets.value.filter(w => w.id !== wallet.id)
}

function getNewId () {
	let i = 0
	while (WalletsData.value.find(w => +w.id === i)) { i++ }
	return i + ''
}