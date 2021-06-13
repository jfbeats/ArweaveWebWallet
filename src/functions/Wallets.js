import ArweaveStore from '@/store/ArweaveStore'
import { generateMnemonic, getKeyFromMnemonic } from "arweave-mnemonic-keys";

export async function newWallet (jwkObj) {
	const jwk = jwkObj || await ArweaveStore.arweave.wallets.generate()
	const key = await ArweaveStore.arweave.wallets.jwkToAddress(jwk)
	if (ArweaveStore.getWalletByKey(key)) { return null }
	const wallet = { id: ArweaveStore.getNewId(), key, jwk }
	if (!jwkObj) { download(key, JSON.stringify(jwk)) }
	ArweaveStore.wallets.push(wallet)
	return wallet.id
}

export async function newPassphrase (passphrase) {
	console.log("started")
	const currentPassphrase = passphrase || await generateMnemonic()
	console.log(currentPassphrase)
	const jwk = await getKeyFromMnemonic(currentPassphrase)
	console.log(jwk)
	newWallet(jwk)
	return currentPassphrase
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
