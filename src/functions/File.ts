import { addWallet, softwareProviders, Wallets } from '@/functions/Wallets'
import router from '@/router'
import Transaction from 'arweave/web/lib/transaction'
import { track } from '@/store/Analytics'
import { addFiles, form } from '@/store/FormSend'
import { FileWithPath as FileWithPathSelector, fromEvent } from 'file-selector'
import { isDraggingFromOutside } from '@/store/InterfaceStore'
export interface FileWithPath extends FileWithPathSelector { normalizedPath?: string }



window.addEventListener('drop', dropped)



export async function dropped (e?: DragEvent | InputEvent | FileSystemDirectoryHandle, type?: 'keyfile' | 'data') {
	if (!e) { return addFiles([]) }
	const text = eventToText(e)
	const files = await eventToFiles(e)
	if (type === 'keyfile') { // todo require async isProviderFor to try on any dropped type
		const keyfiles = await findKeyfiles(text ? [text] : files)
		if (keyfiles.length) { return importKeyfiles(keyfiles) }
	}
	if (type === 'keyfile') { throw 'Error importing keyfiles' }
	// todo unsigned tx - fill send page (through tx import function?)
	// todo signed tx - ask to upload (through tx import function?)
	const goToSend = () => router.currentRoute.value.name !== 'Send' && router.push({ name: 'Send', params: { walletId: Wallets.value[0].id } })
	if (files.length) { addFiles(files); goToSend() }
	else if (text && (isDraggingFromOutside.value || type === 'data')) { form.data = text; goToSend() }
}



function eventToText (e: DragEvent | InputEvent | FileSystemDirectoryHandle) {
	if (!(e && 'dataTransfer' in e && e.dataTransfer && typeof e.dataTransfer === 'object')) { return }
	return e.dataTransfer.getData('text')
}

async function eventToFiles (e: DragEvent | InputEvent | FileSystemDirectoryHandle): Promise<FileWithPath[]> {
	let files = [] as FileWithPath[]
	if ('preventDefault' in e) {
		e.preventDefault()
		files = await fromEvent(e) as FileWithPath[]
		const roots = files.map(file => {
			const path = file.path?.split('/')
			return path?.[0] || path?.[1]
		})
		const hasRoot = roots.every(r => r === roots[0])
		files.forEach(file => {
			let path = file.path?.startsWith('/') ? file.path?.slice(1) : file.path
			Object.defineProperty(file, 'normalizedPath', { value: hasRoot ? path?.split('/').slice(1).join('/') : path })
		})
	} else {
		const handle = e
		for await (const fileHandle of fileSystemAccessApi(handle)) {
			const file = await fileHandle.getFile()
			if (file == null) { continue }
			const path = await handle.resolve(fileHandle)
			if (path) { Object.defineProperty(file, 'path', { value: path.join('/') }) }
			files.push(file as FileWithPath)
		}
		files.forEach(file => Object.defineProperty(file, 'normalizedPath', { value: file.path }))
	}
	return files
}

async function* fileSystemAccessApi (entry: FileSystemDirectoryHandle | FileSystemFileHandle): AsyncGenerator<FileSystemFileHandle> {
	if (entry.kind === 'file') { yield entry }
	else if (entry.kind === 'directory') {
		for await (const handle of entry.values()) {
			yield* fileSystemAccessApi(handle)
		}
	}
}



async function findKeyfiles (files: string[] | FileWithPath[]): Promise<string[]> {
	const results = []
	for (const file of files) {
		const text = typeof file === 'string' ? file : await file.text()
		try {
			const keyfile = JSON.parse(text)
			const provider = softwareProviders.find(provider => provider.metadata.isProviderFor?.({ jwk: keyfile }))
			if (provider) { results.push(text) }
		} catch (e) {}
	}
	return results
}

async function importKeyfiles (files: string[]) {
	const walletPromises = []
	for (const file of files) {
		const data = JSON.parse(file)
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

export function readFile (file: File) {
	return new Promise<Uint8Array>((resolve, reject) => {
		const fileReader = new FileReader()
		fileReader.onload = (e) => resolve(new Uint8Array(e.target?.result as any))
		fileReader.onerror = (e) => reject(e)
		fileReader.readAsArrayBuffer(file)
	})
}