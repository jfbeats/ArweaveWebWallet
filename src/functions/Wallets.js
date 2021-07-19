import ArweaveStore, { arweave, pushWallet } from '@/store/ArweaveStore'
import { loadWallets, saveWallets } from '@/functions/Storage'
import { download } from '@/functions/Utils'
import { getKeyPairFromMnemonic } from 'human-crypto-keys'
import { generateMnemonic, validateMnemonic } from 'bip39'
import crypto from 'libp2p-crypto'

export { generateMnemonic, validateMnemonic }

export async function addMnemonic (mnemonic) {
	let keyPair = await getKeyPairFromMnemonic(mnemonic,
		{ id: "rsa", modulusLength: 4096 }, { privateKeyFormat: "pkcs1-pem" })
	let jwk = (await crypto.keys.import(keyPair.privateKey, ""))._key
	delete jwk.alg
	delete jwk.key_ops
	console.info('generated wallet')
	return addWallet(jwk)
}

export async function addWallet (jwkObj) {
	const jwk = jwkObj || await arweave.wallets.generate()
	const key = await arweave.wallets.jwkToAddress(jwk)
	if (!jwkObj) { download(key, JSON.stringify(jwk)) }
	const wallet = { key, jwk, metaData: { provider: 'jwk' } }
	const walletId = await pushWallet(wallet)
	saveWallets(ArweaveStore.wallets)
	return walletId
}

export async function watchWallet (arweaveWallet) {
	let key
	key ??= arweaveWallet.key
	key ??= arweaveWallet.getActiveAddress ? await arweaveWallet.getActiveAddress() : undefined
	if (!key) { return }
	const wallet = { key, metaData: arweaveWallet.metaData }
	const walletId = await pushWallet(wallet)
	saveWallets(ArweaveStore.wallets)
	return walletId
}

export function deleteWallet (wallet) {
	ArweaveStore.wallets.splice(ArweaveStore.wallets.indexOf(wallet), 1)
	saveWallets(ArweaveStore.wallets)
}

for (const wallet of loadWallets()) { pushWallet(wallet) }



// Testing

if (process.env.NODE_ENV === 'development' && !ArweaveStore.wallets.length) {
	console.log('loading test wallets')
	watchWallet({ key: 'TId0Wix2KFl1gArtAT6Do1CbWU_0wneGvS5X9BfW5PE' })
	watchWallet({ key: 'Bf3pWqxD1qwwF2fcE9bPNyQp_5TSlAYPJ3JNMgJSj4c' })
	watchWallet({ key: 'vLRHFqCw1uHu75xqB4fCDW-QxpkpJxBtFD9g4QYUbfw' })
	watchWallet({ key: 'zYqPZuALSPa_f5Agvf8g2JHv94cqMn9aBtnH7GFHbuA' })
}