import ArweaveStore, { graphql } from '@/store/ArweaveStore'
import type { Transaction as GQLTransaction } from 'arweave-graphql'

import InterfaceStore from '@/store/InterfaceStore'
import { reactive, watch } from 'vue'
import axios from 'axios'
import { awaitEffect, getAsyncData } from '@/functions/AsyncData'



const BlockStore = reactive({
	currentHeight: null,
	currentHeightStatus: {},
	blocks: {},
	blocksStatus: {},
	mempool: {} as { [id: string]: any },
	mempoolStatus: {
		progress: undefined as undefined | number
	},
})

export default BlockStore



const pendingListData = getAsyncData({
	name: 'mempool list',
	query: async () => (await axios.get(ArweaveStore.gatewayURL + 'tx/pending')).data,
	seconds: 10,
})
export const pendingList = pendingListData.state
export const getPending = pendingListData.getState
const mempoolData = getAsyncData({
	name: 'mempool data',
	query: async () => {
		const currentIds = await pendingListData.getState()
		const txs = []
		const ids = currentIds.filter((id: string) => {
			if (!BlockStore.mempool[id]) { return true }
			txs.push(BlockStore.mempool[id])
		})
		console.log('Mempool: fetched from cache', txs.length)
		console.log('Mempool: need to fetch', ids.length)
		const txsTotal = ids.length
		let txsLoaded = 0
		BlockStore.mempoolStatus.progress = 0
		while (ids.length > 0) {
			const idBatch = ids.splice(0, 100)
			const newTxs = (await graphql.getTransactions({ ids: idBatch })).transactions.edges.map(edge => edge.node)
			txsLoaded += idBatch.length
			BlockStore.mempoolStatus.progress = txsLoaded / txsTotal * 100
			newTxs.forEach(newTx => BlockStore.mempool[newTx.id] = newTx)
			txs.push(...newTxs)
		}
		setTimeout(() => delete BlockStore.mempoolStatus.progress, 1000)
		return txs
	},
	seconds: 10,
})
export const mempool = mempoolData.state
export const getMempool = mempoolData.getState