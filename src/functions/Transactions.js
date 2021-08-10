import ArweaveStore, { arweave } from '@/store/ArweaveStore'

export async function buildTransaction (target, ar, tags, data) {
	const txSettings = {
		target: target || '',
		quantity: ar ? arweave.ar.arToWinston(ar) : '0',
	}
	if (data) { txSettings.data = data instanceof File ? await readFile(data) : data }
	const txObj = await arweave.createTransaction(txSettings)
	for (const tag of tags) { txObj.addTag(tag.name, tag.value) }
	return txObj
}

function readFile (file) {
	return new Promise((resolve, reject) => {
		var fileReader = new FileReader()
		fileReader.onload = (e) => resolve(new Uint8Array(e.target.result))
		fileReader.onerror = (e) => reject(e)
		fileReader.readAsArrayBuffer(file)
	})
}

export async function manageUpload (tx) {
	if (!tx.chunks.chunks.length) { return arweave.transactions.post(tx) }
	const uploader = await arweave.transactions.getUploader(tx)
	const storageKey = 'uploader:' + tx.id
	localStorage.setItem(storageKey, JSON.stringify(uploader))
	ArweaveStore.uploads[tx.id] ??= {}
	ArweaveStore.uploads[tx.id].upload = 0
	while (!uploader.isComplete) {
		await uploader.uploadChunk()
		localStorage.setItem(storageKey, JSON.stringify(uploader))
		ArweaveStore.uploads[tx.id].upload = uploader.pctComplete
	}
	localStorage.removeItem(storageKey)
	setTimeout(() => delete ArweaveStore.uploads[tx.id], 1000)
	return uploader.lastResponseStatus
}