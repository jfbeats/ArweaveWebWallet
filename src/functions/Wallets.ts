import { ArweaveProvider, arweave } from '@/store/ArweaveStore'
import { LedgerProvider } from '@/providers/Ledger'
import { Channel } from '@/functions/Channels'
import { passwordEncrypt, passwordDecrypt, pkcs8ToJwk } from '@/functions/Crypto'
import { download } from '@/functions/Utils'
import { getKeyPairFromMnemonic } from 'human-crypto-keys'
import { generateMnemonic as generateM, validateMnemonic as validateM } from 'bip39-web-crypto'
import wordlist from 'bip39-web-crypto/src/wordlists/english.json'
import { computed, reactive } from 'vue'



const WalletsChannel = new Channel('wallets', undefined, [])
export const WalletsData = computed<WalletDataInterface[]>({
	get () { return WalletsChannel.state as any },
	set (value) { WalletsChannel.set(value) }
})



export const ProviderRegistry = {
	arweave: ArweaveProvider,
	ledger: LedgerProvider
}

function selectProvider (wallet: WalletDataInterface) {
	if (wallet.provider && ProviderRegistry[wallet.provider]) { return ProviderRegistry[wallet.provider] }
	for (const provider of Object.values(ProviderRegistry)) { if (provider.isProviderFor?.(wallet)) { return provider } }
	return ProviderRegistry['arweave']
}

type GConstructor<T = {}> = new (...args: any[]) => T
function setProvider<TBase extends GConstructor<Provider>> (Base: TBase) {
	return class WalletProxy extends Base {
		#wallet: WalletDataInterface
		constructor (...args: any[]) {
			super(...args)
			this.#wallet = args[0]
		}
		get id () { return this.#wallet.id + '' }
	}
}



const WalletsStore: { [key: string]: WalletProxy } = {}
export const Wallets = computed<WalletProxy[]>({
	get () {
		const runningWallets = Object.keys(WalletsStore)
		const storageWallets = WalletsData.value.map(w => w.id + '')
		for (const id of [...runningWallets, ...storageWallets]) {
			if (runningWallets.includes(id) && !storageWallets.includes(id)) { delete WalletsStore[id] }
			if (!runningWallets.includes(id) && storageWallets.includes(id)) {
				const wallet = WalletsData.value.find(w => w.id == +id)!
				// WalletsStore[id] = new WalletProxy(wallet)
				const selectedProvider = selectProvider(wallet)!
				const dynamicClass = setProvider(selectedProvider)
				WalletsStore[id] = new dynamicClass(wallet)
			}
		}
		return Object.values(WalletsStore).sort((a, b) => WalletsData.value.findIndex(w => w.id == a.id) - WalletsData.value.findIndex(w => w.id == b.id))
	},
	set (value) {
		WalletsData.value = WalletsData.value.filter(w => value.find(v => v.id == w.id))
			.sort((a, b) => value.findIndex(w => w.id == a.id) - value.findIndex(w => w.id == b.id))
	}
})



export function getWalletById (walletId?: number | string) {
	return Wallets.value.find(wallet => wallet.id == walletId)
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
	return addWallet(jwk)
}

export async function addWallet (jwkObj: JsonWebKey) {
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
	while (WalletsData.value.find(w => w.id === i)) { i++ }
	return i
}