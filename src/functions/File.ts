import { addKeyfile, addWalletData, isWalletData, selectProviders, Wallets } from '@/functions/Wallets'
import { requestImport } from '@/functions/Export'
import { findTransactions } from '@/functions/Transactions'
import { addFiles, form } from '@/store/FormSend'
import router from '@/router'
import { track } from '@/store/Telemetry'
import { fromEvent } from 'file-selector'
import { isDraggingFromOutside } from '@/store/InterfaceStore'



window.addEventListener('drop', dropped)



export async function dropped (e?: DragEvent | InputEvent | FileSystemDirectoryHandle | FileSystemFileHandle[] | string, type?: 'keyfile' | 'data', writing?: true) {
	const goToSend = (owner?: string) => {
		const ownerWalletIndex = Wallets.value.findIndex(w => w.key === owner)
		const walletId = Wallets.value[Math.max(ownerWalletIndex, 0)].id
		if (ownerWalletIndex >= 0 || router.currentRoute.value.name !== 'Send') { router.push({ name: 'Send', params: { walletId } }) }
	}
	if (!e) { if (!writing) { await addFiles([]); return true } else { return } }
	const text = typeof e === 'string' ? e : eventToText(e)
	const files = typeof e === 'string' ? [] : await eventToFiles(e)
	const keyfiles = await findKeyfiles(text ? [text] : files)
	if (keyfiles.length) { await importKeyfiles(keyfiles); return true }
	if (type === 'keyfile') { if (!writing) { throw 'Error importing keyfiles' } else { return } }
	const transactions = await findTransactions(text ? [text] : files)
	if (transactions.length) { await requestImport(transactions); return true }
	if (files.length) { await addFiles(files); goToSend(); return true }
	if (!writing && text && (isDraggingFromOutside.value || type === 'data')) { form.data = text; goToSend(); return true }
}



function eventToText (e: DragEvent | InputEvent | FileSystemDirectoryHandle | FileSystemFileHandle[]) {
	if (!(e && 'dataTransfer' in e && e.dataTransfer && typeof e.dataTransfer === 'object')) { return }
	return e.dataTransfer.getData('text')
}

async function eventToFiles (e: DragEvent | InputEvent | FileSystemDirectoryHandle | FileSystemFileHandle[]): Promise<FileWithPath[]> {
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
		const rootFolderHandle = !Array.isArray(e) && e
		const fileHandles = Array.isArray(e) && e
		const processHandle = async (handle: FileSystemDirectoryHandle | FileSystemFileHandle) => {
			for await (const fileHandle of fileSystemAccessApi(handle)) {
				const file = await fileHandle.getFile()
				if (file == null) { return }
				const path = rootFolderHandle ? await rootFolderHandle.resolve(fileHandle) : [fileHandle.name]
				if (path) { Object.defineProperty(file, 'path', { value: path.join('/') }) }
				files.push(file as FileWithPath)
			}
		}
		if (fileHandles) { await Promise.all(fileHandles.map(handle => processHandle(handle))) }
		if (rootFolderHandle) { await processHandle(rootFolderHandle) }
		files.forEach(file => Object.defineProperty(file, 'normalizedPath', { value: file.path }))
	}
	return files
}

async function* fileSystemAccessApi (entry: FileSystemDirectoryHandle | FileSystemFileHandle): AsyncGenerator<FileSystemFileHandle> {
	if (entry.kind === 'file') { yield entry }
	else if (entry.kind === 'directory') {
		for await (const handle of (entry as any).values()) {
			yield* fileSystemAccessApi(handle)
		}
	}
}



async function findKeyfiles (files: string[] | FileWithPath[]): Promise<string[]> {
	const results = []
	for (const file of files) {
		const text = typeof file === 'string' ? file : await file.text()
		try {
			const isData = isWalletData(text)
			const providers = await selectProviders('keyfile', text)
			if (providers.length || isData) { results.push(text) }
		} catch (e) {}
	}
	return results
}

async function importKeyfiles (keyfiles: string[]) {
	const ids = (await Promise.all(keyfiles.map(async keyfile => {
		if (isWalletData(keyfile)) { return addWalletData(JSON.parse(keyfile)) }
		return addKeyfile(keyfile)
	}))).filter(e => e !== null).map(e => e.id)
	if (ids.length > 0) { router.push({ name: 'EditWallet', query: { wallet: ids } }) }
	track.account('Account Import')
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