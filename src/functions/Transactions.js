import ArweaveStore, { arweave } from "@/store/ArweaveStore"

export async function buildTransaction (tx) {
	const data = tx.data instanceof File ? await readFile(tx.data) : tx.data
	const txObj = await arweave.createTransaction({ target: tx.address, quantity: arweave.ar.arToWinston(tx.amount), data })
	for (const tag of tx.tags) { txObj.addTag(...tag) }
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
	if (tx.data_size < 1000) { return arweave.transactions.post(tx) }
	const uploader = await arweave.transactions.getUploader(tx)
	const storageKey = 'uploader:' + tx.id
	localStorage.setItem(storageKey, JSON.stringify(uploader))
	storedTx = Object.assign(ArweaveStore.txs[tx.id] ??= {}, { upload: 0 })
	while (!uploader.isComplete) {
		await uploader.uploadChunk()
		localStorage.setItem(storageKey, JSON.stringify(uploader))
		storedTx.upload = uploader.pctComplete
	}
	localStorage.removeItem(storageKey)
	delete storedTx.upload
	return uploader.lastResponseStatus
}