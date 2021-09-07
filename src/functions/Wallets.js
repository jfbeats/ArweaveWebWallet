import ArweaveStore, { arweave, pushWallet } from '@/store/ArweaveStore'
import { download } from '@/functions/Utils'
import { getKeyPairFromMnemonic } from 'human-crypto-keys'
import { generateMnemonic, validateMnemonic } from 'bip39'

export { generateMnemonic, validateMnemonic }

export async function addMnemonic (mnemonic) {
	let keyPair = await getKeyPairFromMnemonic(mnemonic, { id: "rsa", modulusLength: 4096 }, { privateKeyFormat: "pkcs8-der" })
	const imported = await window.crypto.subtle.importKey(
		"pkcs8",
		keyPair.privateKey,
		{
			name: "RSA-PSS",
			modulusLength: 4096,
			publicExponent: new Uint8Array([1, 0, 1]),
			hash: "SHA-256",
		},
		true,
		["sign"]
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

export async function downloadWallet (wallet) {
	if (!wallet.jwk) { return }
	const jwk = wallet.jwk
	const key = wallet.key ? wallet.key : await arweave.wallets.jwkToAddress(wallet.jwk)
	download(key, JSON.stringify(jwk))
}

export function loadWallets () {
	let wallets = []
	try { wallets = JSON.parse(localStorage.getItem('wallets')) }
	catch (e) { localStorage.removeItem('wallets') }
	orderWallets(wallets)
	return wallets
}

function orderWallets (wallets) {
	try {
		const order = JSON.parse(localStorage.getItem('walletsOrder'))
		return wallets.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id))
	} catch (e) { localStorage.removeItem('walletsOrder') }
}

export function saveWallets (wallets) {
	if (!wallets) { return }
	const walletsData = []
	for (const wallet of wallets) {
		walletsData.push((({ id, key, jwk, metaData }) => ({ id, key, jwk, metaData }))(wallet))
	}
	localStorage.setItem('wallets', JSON.stringify(walletsData))
}

export function saveWalletsOrder (wallets) {
	if (!wallets) { return }
	const walletsIds = []
	for (const wallet of wallets) {
		walletsIds.push(wallet.id)
	}
	localStorage.setItem('walletsOrder', JSON.stringify(walletsIds))
}

function init () {
	const wallets = loadWallets()
	if (!wallets) { return }
	for (const wallet of wallets) { pushWallet(wallet) }
}
init()

window.addEventListener('storage', (e) => {
	if (e.newValue === e.oldValue) { return }
	else if (e.key === 'wallets') { ArweaveStore.wallets = []; init() }
	else if (e.key == 'walletsOrder') { orderWallets(ArweaveStore.wallets) }
})