import { arweave, arDB } from '@/store/ArweaveStore'
import { sleepUntilVisible } from '@/store/InterfaceStore'
import { reactive, watch } from 'vue'



const BlockStore = reactive({
	currentBlock: null,
	currentBlockStatus: {},
	blocks: {},
	blocksStatus: {},
})

export default BlockStore



export async function getCurrentBlock () {
	if (BlockStore.currentBlockStatus.loading) { return }
	BlockStore.currentBlockStatus.loading = true
	await sleepUntilVisible()

	try {
		BlockStore.currentBlock = (await arweave.network.getInfo())?.height
	} catch (e) { console.error(e) }

	setTimeout(() => BlockStore.currentBlockStatus.loading = false, 60000)
}

export async function getBlocks (min, max) {
	await sleepUntilVisible()
	const newQueries = []
	for (let n = min; n <= max; n++) {
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
				(BlockStore.blocks[transaction.node.block.height] ??= []).push(transaction)
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
	for (let n = min, i = 0; n <= max; n++) { result[n] = transactions[i] }
	console.log(result)
	return result
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

window.getBlocks = getBlocks