import { arweave, pushWallet } from '@/store/ArweaveStore'
import { getKeyPairFromMnemonic } from 'human-crypto-keys'
import { generateMnemonic, validateMnemonic } from 'bip39'
import crypto from 'libp2p-crypto'

export async function addWallet (jwkObj) {
	const jwk = jwkObj || await arweave.wallets.generate()
	const key = await arweave.wallets.jwkToAddress(jwk)
	if (!jwkObj) { download(key, JSON.stringify(jwk)) }
	const wallet = { key, jwk, type: 'jwk' }
	return pushWallet(wallet)
}

export async function addMnemonic (mnemonic) {
	let keyPair = await getKeyPairFromMnemonic(mnemonic,
		{ id: "rsa", modulusLength: 4096 }, { privateKeyFormat: "pkcs1-pem" })
	let jwk = (await crypto.keys.import(keyPair.privateKey, ""))._key
	delete jwk.alg
	delete jwk.key_ops
	console.info('generated wallet')
	return addWallet(jwk)
}

export { generateMnemonic, validateMnemonic }

// export function validateMnemonic (mnemonic) {
// 	return mnemonic.trim().split(/\s+/g).length >= 12
// }

export async function watchWallet (arweaveWallet) {
	const key = await arweaveWallet.getActiveAddress()
	if (!key) { return }
	const wallet = { key, metaData: arweaveWallet.metaData }
	return pushWallet(wallet)
}

function download (filename, text) {
	var element = document.createElement('a')
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
	element.setAttribute('download', filename)
	element.style.display = 'none'
	document.body.appendChild(element)
	element.click()
	document.body.removeChild(element)
}
