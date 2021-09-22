import ArweaveStore, { arweave } from '@/store/ArweaveStore'
import { getPending, getMempool } from '@/store/BlockStore'
import BigNumber from 'bignumber.js'

export async function buildTransaction (target, ar, tags, data, arFee) {
	const txSettings = {
		target: target || '',
		quantity: ar ? arweave.ar.arToWinston(ar) : '0',
	}
	if (data) { txSettings.data = data instanceof File ? await readFile(data) : data }
	const txObj = await arweave.createTransaction(txSettings)
	for (const tag of tags) { txObj.addTag(tag.name, tag.value) }
	txObj.reward = arweave.ar.arToWinston(arFee)
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

export async function getFeeRange () {
	// return { min: new BigNumber('4000000'), max: new BigNumber('60000000'), value: new BigNumber('5000000') }

	const range = { value: null, min: null, max: new BigNumber('145605600') }

	const ids = await getPending()
	if (ids.length <= 1000) { return range }

	const txs = await getMempool(ids)
	const fees = txs.map(tx => tx.node.fee.winston)
	const sortedFees = fees.sort((a, b) => b - a)
	const nextBlock = sortedFees.slice(0, 1000)
	range.min = (new BigNumber(nextBlock.slice(-1)[0])).plus('1')
	range.max = (new BigNumber(nextBlock[0])).plus('1')
	range.value = (new BigNumber(nextBlock.slice(-10)[0])).plus('1')
	return range
}