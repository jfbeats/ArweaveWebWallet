import { addWallet } from '@/functions/Wallets'
import router from '@/router'
import Transaction from 'arweave/web/lib/transaction'
import { track } from '@/store/Analytics'



export async function dropped (files: FileList) {
	// keyfiles - import (through a isKeyfile function)
	return importKeyfiles(files)
	// todo unsigned tx - fill send page (through tx import function?)
	// todo signed tx - ask to upload (through tx import function?)
	// todo else - fill send page file input
}

export async function importKeyfiles (files: FileList) {
	track.account('Import')
	const walletPromises = []
	for (const file of files) {
		// detect type
		const walletPromise = addWallet(JSON.parse(await file.text()))
		walletPromises.push(walletPromise)
	}
	const ids = (await Promise.all(walletPromises)).filter(e => e !== null).map(e => e.id)
	if (ids.length > 0) { router.push({ name: 'EditWallet', query: { wallet: ids } }) }
}

export async function exportTransaction (tx: Transaction) {
	// if signed, don't track
	// find if corresponding message in current connector queue
	download('Transaction', JSON.stringify(tx))
	// await for matching importTransaction before completing
}



export function download (filename: string, text: string, contentType = 'application/json') {
	const element = document.createElement('a')
	element.setAttribute('href', `data:${contentType};charset=utf-8,${encodeURIComponent(text)}`)
	element.setAttribute('download', filename)
	element.style.display = 'none'
	document.body.appendChild(element)
	element.click()
	document.body.removeChild(element)
}
