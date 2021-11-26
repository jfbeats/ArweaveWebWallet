import { ArweaveWallet, arweave } from '@/store/ArweaveStore'
import { getChannel } from '@/functions/Channels'
import { passwordEncrypt, passwordDecrypt } from '@/functions/Crypto'
import { download } from '@/functions/Utils'
import { getKeyPairFromMnemonic } from 'human-crypto-keys'
import { generateMnemonic as generateM, validateMnemonic as validateM } from 'bip39-web-crypto'
import wordlist from 'bip39-web-crypto/src/wordlists/english.json'
import { computed, reactive } from 'vue'



// wallet: { id, key, jwk: jwk | jwk[], provider: jwk | ledger, protocols: ['arweave'] } metadata, functions, settings
const WalletsChannel = getChannel('wallets', undefined, [])
export const Wallets = computed({
	get () { return WalletsChannel.state },
	set (value) { WalletsChannel.set(value) }
})

const wallets = {}
export class Wallet {
	constructor (wallet) {
		wallets.arweave = reactive(new ArweaveWallet(wallet))
	}
	
}

export function getWalletById (walletId) {
	const wallet = Wallets.value.find(wallet => wallet.id == walletId)
	wallets[wallet.key] ??= new ArweaveWallet(wallet)
	return wallets[wallet.key]
}



export async function generateMnemonic () {
	return generateM(undefined, undefined, wordlist)
}

export async function validateMnemonic (mnemonic) {
	return validateM(mnemonic, wordlist)
}

export async function addMnemonic (mnemonic) {
	let keyPair = await getKeyPairFromMnemonic(mnemonic, { id: 'rsa', modulusLength: 4096 }, { privateKeyFormat: 'pkcs8-der' })
	const imported = await window.crypto.subtle.importKey(
		'pkcs8',
		keyPair.privateKey,
		{
			name: 'RSA-PSS',
			modulusLength: 4096,
			publicExponent: new Uint8Array([1, 0, 1]),
			hash: 'SHA-256',
		},
		true,
		['sign']
	)
	let jwk = await window.crypto.subtle.exportKey('jwk', imported)
	delete jwk.alg
	delete jwk.key_ops
	console.info('generated wallet')
	return addWallet(jwk)
}

export async function addWallet (jwkObj) {
	const jwk = jwkObj || await arweave.wallets.generate()
	const key = await arweave.wallets.jwkToAddress(jwk)
	if (!jwkObj) { download(key, JSON.stringify(jwk)) }
	const wallet = { id: getNewId(), key, jwk }
	Wallets.value.push(wallet)
	return wallet.id
}

export async function watchWallet (arweaveWallet) {
	const key = arweaveWallet.key
		|| arweaveWallet.getActiveAddress ? await arweaveWallet.getActiveAddress() : undefined
	if (!key) { return }
	const wallet = { id: getNewId(), key, provider: arweaveWallet.provider }
	Wallets.value.push(wallet)
	return wallet.id
}

export function deleteWallet (wallet) {
	Wallets.value.splice(Wallets.value.indexOf(wallet), 1)
}

export async function downloadWallet (wallet) {
	if (!wallet.jwk) { return }
	const jwk = wallet.jwk
	const key = wallet.key ? wallet.key : await arweave.wallets.jwkToAddress(wallet.jwk)
	download(key, JSON.stringify(jwk))
}

export function getNewId () {
	for (let i = 0; i <= Wallets.value.length; i++) {
		if (Wallets.value.map(e => e.id).indexOf(i) === -1) { return i }
	}
}