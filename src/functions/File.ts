import { addWallet, softwareProviders, Wallets } from '@/functions/Wallets'
import router from '@/router'
import Transaction from 'arweave/web/lib/transaction'
import { track } from '@/store/Analytics'
import { FileWithPath, fromEvent } from 'file-selector'
import { addFiles } from '@/store/FormSend'



window.addEventListener('dragover', e => e.preventDefault())
window.addEventListener('drop', dropped)



async function eventToFiles (e: DragEvent | InputEvent): Promise<FileWithPath[]> {
	e.preventDefault()
	return fromEvent(e) as Promise<FileWithPath[]>
}



export async function dropped (e?: DragEvent | InputEvent) {
	if (!e) { return addFiles([]) }
	const files = await eventToFiles(e)
	const keyfiles = await findKeyfiles(files)
	if (keyfiles.length) { return importKeyfiles(keyfiles) }
	// todo unsigned tx - fill send page (through tx import function?)
	// todo signed tx - ask to upload (through tx import function?)
	// todo else - fill send page file input
	addFiles(files)
	if (router.currentRoute.value.name !== 'Send') { router.push({ name: 'Send', params: { walletId: Wallets.value[0].id } }) }
}

export async function droppedKeyfiles (e: DragEvent | InputEvent) {
	const files = await eventToFiles(e)
	const keyfiles = await findKeyfiles(files)
	if (!keyfiles.length) { throw 'Error importing keyfiles' }
	importKeyfiles(keyfiles)
}



async function findKeyfiles (files: FileWithPath[]) {
	const results = []
	for (const file of files) {
		try {
			const data = JSON.parse(await file.text())
			const provider = softwareProviders.find(provider => provider.metadata.isProviderFor?.({ jwk: data }))
			if (provider) { results.push(file) }
		} catch (e) {}
	}
	return results
}

async function importKeyfiles (files: FileWithPath[]) {
	const walletPromises = []
	for (const file of files) {
		const data = JSON.parse(await file.text())
		const walletPromise = addWallet(data)
		walletPromises.push(walletPromise)
	}
	const ids = (await Promise.all(walletPromises)).filter(e => e !== null).map(e => e.id)
	if (ids.length > 0) { router.push({ name: 'EditWallet', query: { wallet: ids } }) }
	track.account('Import')
}



export async function exportTransaction (tx: Transaction) {
	// notify user of export
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
