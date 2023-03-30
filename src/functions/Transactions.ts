import ArweaveStore, { arweave, arweaveQuery } from '@/store/ArweaveStore'
import InterfaceStore from '@/store/InterfaceStore'
import { getMempool, getPending } from '@/store/BlockStore'
import { notify } from '@/store/NotificationStore'
import { track } from '@/store/Telemetry'
import BigNumber from 'bignumber.js'
import { PromisePool } from '@supercharge/promise-pool'
import { encode } from '@/functions/Encode'
import Transaction from 'arweave/web/lib/transaction'
import type { CreateTransactionInterface } from 'arweave/web'
import { requestExport } from '@/functions/Export'
import { Wallets } from '@/functions/Wallets'
import { compact } from '@/functions/Utils'



export type AnyFile = string | FileWithPath | object | undefined
export type ExportRequest = {
	entry: ExportEntry
	compressed?: any
	promise: Promise<AnyTransaction>
	resolve: (arg: AnyTransaction) => void
	reject: (e?: string) => void
}



export async function buildTransaction (tx: ArTxParams) {
	if (!arweave) { await new Promise(res => setTimeout(res)) } // todo fix
	const txSettings = {} as Partial<CreateTransactionInterface>
	txSettings.target = tx.target || ''
	txSettings.quantity = tx.quantity || tx.winston || (tx.ar ? arweave.ar.arToWinston(tx.ar) : '0')
	txSettings.reward = tx.reward || tx.winstonReward || (tx.arReward ? arweave.ar.arToWinston(tx.arReward) : undefined)
	if (tx.data) { txSettings.data = tx.data }
	const txObj = await arweave.createTransaction(txSettings)
	for (const tag of tx.tags || []) { txObj.addTag(tag.name, tag.value) }
	if (txSettings.reward) { txObj.reward = txSettings.reward }
	return txObj
}

export async function deduplicate (transactions: ArDataItemParams[], trustedAddresses?: string[]): Promise<Array<string | undefined>> {
	const entries = (await PromisePool.for(transactions).withConcurrency(5).process(async tx =>
		({ tx, hash: tx.tags?.find(tag => tag.name === 'File-Hash')?.value || await getHash(tx) }))).results
	const chunks = [] as typeof entries[]
	while (entries.length) { chunks.push(entries.splice(0, 500)) }
	return (await PromisePool.for(chunks).withConcurrency(3).process(async chunk => {
		const hashes = chunk.map(entry => entry.hash)
		const query = await arweaveQuery({ tags: { name: 'File-Hash', values: hashes }, first: 100 }).fetchAll()
		return (await PromisePool.for(chunk).withConcurrency(3).process(async entry => {
			const result = query.value
				.filter(tx => tx.node.tags.find(tag => tag.name === 'File-Hash' && tag.value === entry.hash))
				.filter(tx => !entry.tx.tags || hasMatchingTags(entry.tx.tags, tx.node.tags))
			for (const tx of result) {
				const verified = trustedAddresses ? trustedAddresses.includes(tx.node.owner.address) : await verifyData(entry.hash, tx.node.id)
				if (verified) { return tx }
			}
		})).results
	})).results.flat().map(tx => tx?.node.id)
}

async function verifyData (hash: string, id: string) {} // todo store verification results in cache

function hasMatchingTags(requiredTags: { name: string; value: string }[], existingTags: { name: string; value: string }[]): Boolean {
	return !requiredTags.find(requiredTag => !existingTags.find(existingTag =>
		existingTag.name === requiredTag.name && existingTag.value === requiredTag.value))
}

export async function getHash (tx: { data: CreateTransactionInterface['data'] }) {
	const data = typeof tx.data === 'string' ? encode(tx.data) : tx.data
	const buffer = await window.crypto.subtle.digest('SHA-256', data)
	return [...new Uint8Array(buffer)].map(x => x.toString(16).padStart(2, '0')).join('')
}

export function generateManifest (localPaths: string[], transactions: Array<{ id: string } | string>, index?: string) {
	if (localPaths.length !== transactions.length) { throw 'Length mismatch' }
	if (index && !localPaths.includes(index)) { throw 'Unknown index' }
	const paths = {} as { [key: string]: { id: string } }
	localPaths.forEach((path, i) => {
		if (!path) { throw 'Path undefined' }
		const tx = transactions[i]
		const id = typeof tx === 'string' ? tx : tx.id
		paths[path] = { id }
	})
	const indexParam = index ? { index: { path: index } } : {}
	return {
		data: JSON.stringify({
			manifest: 'arweave/paths',
			version: '0.1.0',
			...indexParam,
			paths,
		}),
		tags: [{ name: 'Content-Type', value: 'application/x.arweave-manifest+json' }]
	}
}



export async function manageUpload (tx: AnyTransaction) {
	if (!InterfaceStore.online) { return requestExport({ tx }) }
	if (!tx.chunks?.chunks?.length) { arweave.transactions.post(tx); notify.log('Transaction sent'); return }
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
	if (tx.quantity && tx.quantity !== '0' && tx.data_size && tx.data_size !== '0') { track.event('Tx Value Data') }
	else if (tx.quantity && tx.quantity !== '0') { track.event('Tx Value') }
	else if (tx.data_size && tx.data_size !== '0') { track.event('Tx Data') }
	else { track.event('Tx Empty') }
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
	if (txs.length < (ids.length / 10)) {
		notify.warn('Unable to estimate optimal transaction fee. The gateway is returning data on less than 10% of pending transactions.')
		failedLastFeeRange = true
		return range
	}
	failedLastFeeRange = false
	range.min = (new BigNumber(nextBlock.slice(-1)[0])).plus('1')
	range.default = (new BigNumber(nextBlock.slice(-(txs.length/10))[0])).plus('1')
	return range
}

export function unpackTags <T extends boolean = false> (tags?: { name: string, value: string }[], options?: { duplicate?: T, lowercase?: boolean }) {
	const result = {} as { [key:string]: any }
	if (!tags) { return result as { [key: string]: (T extends true ? string[] : string | undefined) } }
	const set = options?.duplicate
		? (tag: typeof tags[0]) => (result[options?.lowercase ? tag.name.toLowerCase() : tag.name] ??= []).push(tag.value)
		: (tag: typeof tags[0]) => result[options?.lowercase ? tag.name.toLowerCase() : tag.name] ??= tag.value
	tags.forEach(set)
	return result as { [key: string]: (T extends true ? string[] : string | undefined) }
}



type ExportTemplates = Awaited<ReturnType<typeof makeTemplates>>
export type ExportTemplate = ExportTemplates[keyof ExportTemplates]

async function makeTemplates () {
	const trimmed = [] as AnyTransaction[]
	const ar = (async () => {
		const trim = (tx: Transaction) => {
			const { chunks, data, ...ar } = tx
			trimmed.push(tx)
			return ar
		}
		const build = (tx: Partial<Transaction>) => tx.setSignature ? tx as Transaction : arweave.transactions.fromRaw(tx)
		const compress = (txIn: Transaction, tx?: Transaction) => {
			const { owner, ...ownerless } = tx ?? txIn
			if (!tx || txIn.owner && txIn.owner === owner) { return ownerless }
			return tx
		}
		const verify = async (tx: any) => arweave.transactions.verify(tx).catch(() => false)
		const getBaseTx = () => buildTransaction({ data: 'hey' }).then(tx => {
			const trimmed = compress(trim(tx) as any)
			localStorage.setItem('template:ar', JSON.stringify(trimmed))
			return trimmed
		}).catch(e => {
			const template = localStorage.getItem('template:ar')
			if (!template) { throw e }
			return JSON.parse(template)
		})
		return {
			template: await getBaseTx().catch(() => getBaseTx()),
			getOwner: (tx: any) => tx.owner,
			isSigned: (tx: any) => 'signature' in tx && tx.signature,
			equals: (a: Transaction, b: AnyTransaction) => {
				if (a.owner && b.owner && a.owner !== b.owner) { return false }
				if (!hasMatchingTags(a.tags, b.tags)) { return false }
				const fields: Array<keyof Transaction> = ['target', 'data_root', 'quantity']
				return fields.every(field => a[field] === b[field])
			},
			init: async (tx: ReturnType<typeof trim>) => {
				// todo handle transaction with unavailable data for both signed and unsigned
				tx.data_root && trimmed.find((trimmed: AnyTransaction) => {
					if (tx.data_root !== trimmed.data_root) { return }
					tx.chunks = trimmed.chunks
					tx.data = trimmed.data
					return true
				})
				if (!tx.owner && tx.signature) {
					const owners = compact(Wallets.value.map(w => Object.values(w.data).map(v => v.publicKey)).flat())
					trimmed.forEach(t => owners.includes(t.owner) || owners.push(t.owner))
					const res = await Promise.all(owners.map(owner => build({ ...tx, owner })).map(tx => verify(tx)))
					tx.owner = owners[res.findIndex(r => r)]
					if (!tx.owner) { notify.error('Unable to infer transaction owner'); throw 'unknown owner' }
				}
				const result = build(tx)
				if (result.data?.byteLength) { await result.prepareChunks(result.data) }
				return result
			}, trim, compress, verify
		} as const
	})()
	return {
		arweave: await ar,
	} as const
}

const templatesPromise = makeTemplates().catch(e => notify.warn('failed to initialize transactions ' + e))



export type ExportEntry = Awaited<ReturnType<typeof findTransactions>>[number]

export async function findTransactions (files: AnyFile | AnyFile[]) {
	const results = []
	const templates = await templatesPromise
	for (const file of Array.isArray(files) ? files : [files]) {
		try {
			if (file == undefined) { continue }
			const obj = typeof file === 'string' ? JSON.parse(file) : 'text' in file && typeof file.text === 'function' ? JSON.parse(await file.text()) : file
			const entries = Object.entries(templates).filter(([name, format]) => Object.keys(format.template).every(key => key in obj))
			const provider = entries.map(e => e[1])[0] as ExportTemplate
			const res = entries.length && {
				tx: obj as AnyTransaction,
				init: () => provider.init(obj),
				provider,
				equals: (b: AnyTransaction) => provider.equals(obj, b),
				owner: entries.map(([name, format]) => format.getOwner(obj)).find(entry => entry) as string,
				isSigned: entries.some(([name, format]) => format.isSigned(obj))
			}
			if (res) { results.push(res) }
		} catch (e) {}
	}
	return results
}