import ArweaveStore, { arweave, arweaveQuery } from '@/store/ArweaveStore'
import { getMempool, getPending } from '@/store/BlockStore'
import { exportTransaction, FileWithPath, readFile } from '@/functions/File'
import { notify } from '@/store/NotificationStore'
import { track } from '@/store/Analytics'
import BigNumber from 'bignumber.js'
import { PromisePool } from '@supercharge/promise-pool'
import type Transaction from 'arweave/web/lib/transaction'
import type { CreateTransactionInterface } from 'arweave/web'



export async function buildTransaction (tx: ArTxParams) {
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

export async function deduplicate (transactions: Transaction[], trustedAddresses?: string[]): Promise<Array<string | undefined>> {
	const entries = (await PromisePool.for(transactions).withConcurrency(5).process(async tx => ({ tx, hash: await getHash(tx) }))).results
	const chunks = [] as typeof entries[]
	while (entries.length) { chunks.push(entries.splice(0, 500)) }
	return (await PromisePool.for(chunks).withConcurrency(3).process(async chunk => {
		const hashes = chunk.map(entry => entry.hash)
		const query = await arweaveQuery({ tags: { name: 'File-Hash', values: hashes }, first: 100 }).fetchAll()
		return (await PromisePool.for(chunk).withConcurrency(3).process(async entry => {
			const result = query.value
				.filter(tx => tx.node.tags.find(tag => tag.name === 'File-Hash' && tag.value === entry.hash))
				.filter(tx => hasMatchingTags(entry.tx.tags, tx.node.tags))
			for (const tx of result) {
				const verified = trustedAddresses ? trustedAddresses.includes(tx.node.owner.address) : await verifyData(entry.hash, tx.node.id)
				if (verified) { return tx }
			}
		})).results
	})).results.flat().map(tx => tx?.node.id)
}

async function verifyData (hash: string, id: string) {}

function hasMatchingTags(requiredTags: { name: string; value: string }[], existingTags: { name: string; value: string }[]): Boolean {
	return !requiredTags.find(requiredTag => !existingTags.find(existingTag =>
		existingTag.name === requiredTag.name && existingTag.value === requiredTag.value))
}

async function getHash (tx: Transaction) {
	const buffer = await window.crypto.subtle.digest('SHA-256', tx.data)
	return [...new Uint8Array(buffer)].map(x => x.toString(16).padStart(2, '0')).join('')
}

export async function generateManifest (files: FileWithPath[], transactions: Array<{ id: string } | string>, index: FileWithPath) { // todo data item not transaction
	if (files.length !== transactions.length) { throw 'Length mismatch' }
	if (files.includes(index)) { throw 'Unknown index' }
	const paths = {} as { [key: string]: { id: string } }
	Object.entries(files).forEach(([i, file]) => {
		if (!file.normalizedPath) { throw 'Path undefined' }
		const tx = transactions[+i]
		const id = typeof tx === 'string' ? tx : tx.id
		paths[file.normalizedPath!] = { id }
	})
	return {
		data: { manifest: 'arweave/paths', version: '0.1.0', index: { path: index.normalizedPath! }, paths },
		tag: { name: 'Content-Type', value: 'application/x.arweave-manifest+json' }
	}
}



export async function manageUpload (tx: Transaction) {
	if (!navigator.onLine) { return exportTransaction(tx) }
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
	notify.log('Transaction sent')
	track.event('tx', 'Sent')
	return uploader.lastResponseStatus
}

let failedLastFeeRange = false
export async function getFeeRange () {
	const blockSize = 1000
	const range = {
		default: null as null | BigNumber,
		min: null as null | BigNumber,
		max: new BigNumber('145605600')
	}
	const ids = await getPending(failedLastFeeRange)
	if (ids.length <= blockSize) { return range }
	const txs = await getMempool(failedLastFeeRange)
	if (!txs) { throw 'failed to get pending transactions list' }
	const fees = txs.map(tx => tx.fee.winston)
	const sortedFees = fees.sort((a, b) => (+b) - (+a))
	const nextBlock = sortedFees.slice(0, blockSize)
	range.max = (new BigNumber(nextBlock[0])).plus('1')
	if (txs.length < (ids.length / 4)) {
		notify.warn('Unable to estimate optimal transaction fee')
		failedLastFeeRange = true
		return range
	}
	failedLastFeeRange = false
	range.min = (new BigNumber(nextBlock.slice(-1)[0])).plus('1')
	range.default = (new BigNumber(nextBlock.slice(-(txs.length/10))[0])).plus('1')
	return range
}

export function unpackTags <T extends boolean = false> (tags: { name: string, value: string }[], options?: { duplicate?: T, lowercase?: boolean }) {
	const result = {} as { [key:string]: any }
	const set = options?.duplicate
		? (tag: typeof tags[0]) => (result[options?.lowercase ? tag.name.toLowerCase() : tag.name] ??= []).push(tag.value)
		: (tag: typeof tags[0]) => result[options?.lowercase ? tag.name.toLowerCase() : tag.name] ??= tag.value
	tags.forEach(set)
	return result as { [key:string]: (T extends true ? string[] : string) }
}