import ArweaveStore, { arweave, arDB } from '@/store/ArweaveStore'
import { sleepUntilVisible } from '@/store/InterfaceStore'
import { reactive, watch } from 'vue'
import axios from 'axios'



const BlockStore = reactive({
	currentHeight: null,
	currentHeightStatus: {},
	blocks: {},
	blocksStatus: {},
	mempool: {},
	mempoolStatus: {},
})

export default BlockStore



export async function getCurrentHeight () {
	if (BlockStore.currentHeightStatus.loading) { return currentHeightPromise() }
	BlockStore.currentHeightStatus.loading = true
	await sleepUntilVisible()

	try {
		BlockStore.currentHeight = (await arweave.network.getInfo())?.height
	} catch (e) { console.error(e) }

	setTimeout(() => BlockStore.currentHeightStatus.loading = false, 60000)
	return BlockStore.currentHeight
}

export async function getBlocks (min, max) {
	await sleepUntilVisible()
	const newQueries = []
	for (let n = min; n <= max; n++) {
		BlockStore.blocks[n] ??= []
		BlockStore.blocksStatus[n] ??= {}
		if (BlockStore.blocksStatus[n]?.completed) { continue }
		if (!BlockStore.blocksStatus[n]?.loading) { newQueries.push(n) }
	}
	const rangesQuery = groupContinuousNumbers(newQueries)

	console.log('querying blocks', rangesQuery)

	const fetchRange = async (min, max) => {
		try {
			const transactions = await arDB.search().min(min).max(max).findAll()
			for (let n = min; n <= max; n++) { BlockStore.blocksStatus[n].completed = true }
			for (const transaction of transactions) {
				BlockStore.blocks[transaction.node.block.height].push(transaction)
			}
		} catch (e) {
			console.log(e)
		} finally {
			for (let n = min; n <= max; n++) { BlockStore.blocksStatus[n].loading = false }
		}
	}

	for (const [min, max] of rangesQuery) { fetchRange(min, max) }

	const promises = []
	for (let n = min; n <= max; n++) { promises.push(blockPromise(n)) }
	const transactions = await Promise.all(promises)
	const result = {}
	for (let n = min, i = 0; n <= max; n++) { result[n] = transactions[i++] }
	console.log(result)
	return result
}

export async function getPending () {
	return (await axios.get(ArweaveStore.gatewayURL + 'tx/pending')).data
}

export async function getMempool (pending) {
	const currentIds = pending || await getPending()
	const txs = []
	const ids = currentIds.filter((id) => {
		if (!BlockStore.mempool[id]) { return true }
		txs.push(BlockStore.mempool[id])
	})
	const txsTotal = ids.length
	let txsLoaded = 0
	BlockStore.mempoolStatus.loading = 0
	while (ids.length > 0) {
		const idBatch = ids.splice(0, 500)
		const newTxs = await arDB.search().ids(idBatch).findAll()
		txsLoaded += idBatch.length
		BlockStore.mempoolStatus.loading = txsLoaded / txsTotal
		newTxs.forEach(newTx => BlockStore.mempool[newTx.node.id] = newTx)
		txs.push(... newTxs)
	}
	setTimeout(() => delete BlockStore.mempoolStatus.loading, 1000)
	return txs
}



function currentHeightPromise () {
	return new Promise(resolve => {
		watch(() => BlockStore.currentHeight, (height) => {
			if (height) { resolve(height) }
		})
	})
}

function groupContinuousNumbers (blocks) {
	if (!blocks.length) { return [] }
	const ranges = []
	let rangeStart = 0
	for (let i = 0; i < blocks.length; i++) {
		if (i === blocks.length - 1 || blocks[i + 1] - blocks[i] !== 1) {
			ranges.push([blocks[rangeStart], blocks[i]])
			rangeStart = i + 1
		}
	}
	return ranges
}

function blockPromise (n) {
	return new Promise(resolve => {
		watch(() => BlockStore.blocksStatus[n], (status) => {
			if (status.completed) { resolve(BlockStore.blocks[n]) }
			else if (status.loading === false) { throw `error when loading block ${n}` }
		}, { immediate: true, deep: true })
	})
}


if (process.env.NODE_ENV === 'development') {
	window.BlockStore = BlockStore
	window.getBlocks = getBlocks
}
