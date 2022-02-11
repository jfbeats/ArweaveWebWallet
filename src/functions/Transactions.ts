import ArweaveStore, { arweave } from '@/store/ArweaveStore'
import { getPending, getMempool } from '@/store/BlockStore'
import BigNumber from 'bignumber.js'
import { CreateTransactionInterface } from 'arweave/web'
import Transaction from 'arweave/web/lib/transaction'
import { download } from '@/functions/Utils'

export type TxParams = {
	target?: string
	quantity?: string
	ar?: string
	winston?: string
	reward?: string
	arReward?: string
	winstonReward?: string
	tags?: { name: string, value: string }[]
	data?: string | File
}
export async function buildTransaction (tx: TxParams) {
	const txSettings = {} as Partial<CreateTransactionInterface>
	txSettings.target = tx.target || ''
	txSettings.quantity = tx.quantity || tx.winston || (tx.ar ? arweave.ar.arToWinston(tx.ar) : '0')
	txSettings.reward = tx.reward || tx.winstonReward || (tx.arReward ? arweave.ar.arToWinston(tx.arReward) : undefined)
	if (tx.data) { txSettings.data = tx.data instanceof File ? await readFile(tx.data) : tx.data }
	const txObj = await arweave.createTransaction(txSettings)
	for (const tag of tx.tags || []) { txObj.addTag(tag.name, tag.value) }
	if (txSettings.reward) { txObj.reward = txSettings.reward }
	return txObj
}

function readFile (file: File) {
	return new Promise<Uint8Array>((resolve, reject) => {
		const fileReader = new FileReader()
		fileReader.onload = (e) => resolve(new Uint8Array(e.target?.result as any))
		fileReader.onerror = (e) => reject(e)
		fileReader.readAsArrayBuffer(file)
	})
}

export async function manageUpload (tx: Transaction) {
	if (!tx.chunks?.chunks?.length) { return arweave.transactions.post(tx) }
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
	const blockSize = 1000
	const range = {
		default: null as null | BigNumber,
		min: null as null | BigNumber,
		max: new BigNumber('145605600')
	}
	const ids = await getPending()
	if (ids.length <= blockSize) { return range }
	const txs = await getMempool()
	const fees = txs.map(tx => tx.fee.winston)
	const sortedFees = fees.sort((a, b) => (+b) - (+a))
	const nextBlock = sortedFees.slice(0, blockSize)
	range.min = (new BigNumber(nextBlock.slice(-1)[0])).plus('1')
	range.max = (new BigNumber(nextBlock[0])).plus('1')
	range.default = (new BigNumber(nextBlock.slice(-(blockSize/10))[0])).plus('1') // use % of result length instead of offset
	return range
}

export function unpackTags (tags: { name: string, value: string }[]) {
	const result = {} as { [key:string]: string }
	for (const { name, value } of tags) { result[name] ??= value }
	return result
}

export function unpackTagsDuplicated (tags: { name: string, value: string }[]) {
	const result = {} as { [key:string]: string[] }
	for (const { name, value } of tags) { (result[name] ??= []).push(value) }
	return result
}

export async function exportTransaction (tx: Transaction) {
	// find if corresponding message in current connector queue
	download('Transaction', JSON.stringify(tx))
	// await for matching importTransaction before completing
}