import Arweave from 'arweave'
import type { BlockEdge as GQLBlockEdge, TransactionEdge as GQLTransactionEdge } from 'arweave-graphql'
import arweaveGraphql, { SortOrder } from 'arweave-graphql'
import { generateUrl } from '@/functions/Utils'
import { useChannel } from '@/functions/Channels'
import { getAsyncData, getQueryManager, getReactiveAsyncData } from '@/functions/AsyncData'
import { isRef, reactive, ref, Ref, watch } from 'vue'
import { Emitter } from '@/functions/UtilsClass'



export const gatewayDefault = 'https://arweave.net/'
export const bundlerDefault = 'https://node2.bundlr.network/'

if (localStorage.getItem('gateway') === JSON.stringify(gatewayDefault)) { localStorage.removeItem('gateway') } // todo remove, temp conversion
if (localStorage.getItem('bundler') === JSON.stringify(bundlerDefault)) { localStorage.removeItem('bundler') } // todo remove, temp conversion

const ArweaveStore = reactive({
	gatewayURL: useChannel('gateway', undefined, gatewayDefault).state,
	bundlerURL: useChannel('bundler', undefined, bundlerDefault).state,
	uploads: {} as { [key: string]: { upload?: number } },
})

export default ArweaveStore
export let arweave: Arweave



export function urlToSettings (url: string) {
	const obj = new URL(url)
	const protocol = obj.protocol.replace(':', '')
	const host = obj.hostname
	const port = obj.port ? parseInt(obj.port) : protocol === 'https' ? 443 : 80
	return { protocol, host, port }
}

export async function updateArweave (url?: string, sync?: boolean) {
	url = url ? generateUrl(url) : gatewayDefault
	const settings = urlToSettings(url)
	if (!sync && url !== gatewayDefault) {
		const arweaveTest = Arweave.init(settings)
		const net = await arweaveTest.network.getInfo()
		if (!net.network) { throw 'Invalid' }
	}
	arweave = Arweave.init(settings)
	ArweaveStore.gatewayURL = url !== gatewayDefault ? url : undefined as any
	// todo if network name is different, clear all cache
}

export async function updateBundler (url?: string, sync?: boolean) {
	url = url ? generateUrl(url) : bundlerDefault
	ArweaveStore.bundlerURL = url !== bundlerDefault ? url : undefined as any
}

export function useWatchTx (txId: Ref<string | undefined>) {
	return getReactiveAsyncData({
		name: 'single tx header',
		params: txId,
		query: async (txId) => (await graphql().getTransactions({ ids: [txId] })).transactions.edges[0]?.node,
		completed: (state: any) => state?.block,
		seconds: 10,
	})
}

export async function fetchPublicKey (address: string) {
	const tx = (await graphql().getTransactions({ owners: [address] })).transactions.edges
	return tx?.[0]?.node.owner.key as string | undefined
}



const blockSort = (a: GQLTransactionEdge, b: GQLTransactionEdge) => (b.node.block?.height ?? Number.MAX_SAFE_INTEGER)
	- (a.node.block?.height ?? Number.MAX_SAFE_INTEGER)

export const graphql = () => arweaveGraphql((ArweaveStore.gatewayURL || 'https://arweave.net/') + 'graphql')



type arweaveQueryOptions = Parameters<ReturnType<typeof graphql>['getTransactions']>[0] | Ref<Parameters<ReturnType<typeof graphql>['getTransactions']>[0]>

export function arweaveQuery (options: arweaveQueryOptions, name = 'tx list') { // todo rename to arweaveTransactions, fix changing query while loading
	const optionsRef = isRef(options) ? options : ref(options)
	const status = reactive({ completed: false, reset: 0 })
	const data = ref([] as GQLTransactionEdge[])
	const refresh = 10
	const refreshEnabled = ref(false)
	const refreshSwitch = ref(true) // todo
	const emitter = new Emitter<{ newContent: undefined }>()
	
	watch(optionsRef, () => {
		data.value = []
		refreshEnabled.value = false
		status.completed = false
		status.reset++
	}, { deep: true })
	
	const fetchQuery = getQueryManager({
		name: name + ' fetch',
		query: async () => {
			if (optionsRef.value == null || status.completed) { return data.value }
			let fulfilled = false
			let results: any
			try {
				const firstFetch = !data.value.length
				for (let i = 0; !fulfilled; i++) {
					if (i === 0 && firstFetch) {
						results = await graphql().getTransactions(optionsRef.value)
					} else {
						const cursor = data.value[data.value.length - 1].cursor
						results = await graphql().getTransactions({ ...optionsRef.value, after: cursor })
					}
					if (!results.transactions.pageInfo.hasNextPage) { status.completed = true; fulfilled = true }
					results = results.transactions.edges
					if (results.length < 10) { status.completed = true; fulfilled = true } // todo remove??
					if (results[results.length - 1]?.node.block) { fulfilled = true }
					data.value.push(...results)
				}
				if (firstFetch) { setTimeout(() => refreshEnabled.value = true, refresh * 1000) }
			}
			catch (e) { console.error(e); await new Promise<void>(res => setTimeout(() => res(), 10000)); throw e }
			return results as Awaited<ReturnType<ReturnType<typeof graphql>['getTransactions']>>['transactions']['edges']
		},
	})
	
	const updateQuery = getAsyncData({
		name: name + ' update',
		awaitEffect: () => !fetchQuery.queryStatus.running && refreshEnabled.value,
		query: async () => {
			let requireSort = false
			let newContent = false
			let fulfilled = false
			let results: any
			for (let i = 0; !fulfilled; i++) {
				if (i === 0) { results = await graphql().getTransactions(optionsRef.value) }
				else {
					if (!results) { return }
					const cursor = results[results.length - 1].cursor
					results = await graphql().getTransactions({ ...optionsRef.value, after: cursor })
				}
				if (!results.transactions.pageInfo.hasNextPage) { status.completed = true; fulfilled = true }
				results = results.transactions.edges
				if (results.length < 10) { status.completed = true; fulfilled = true }
				const resultsFiltered = []
				for (const result of results) {
					const matchingTx = data.value.find(el => el.node.id === result.node.id)
					if (matchingTx) {
						if (matchingTx.node.block) { fulfilled = true }
						else if (result.node.block) { Object.assign(matchingTx, result); requireSort = true; newContent = true }
					} else {
						resultsFiltered.push(result)
						if (result.node.block) { requireSort = true; newContent = true }
					}
				}
				if (resultsFiltered.length > 0) { data.value.splice(0, 0, ...resultsFiltered) }
				if (requireSort) { data.value.sort(blockSort); requireSort = false }
			}
			if (newContent) { emitter.emit('newContent', undefined) }
			return results
		},
		seconds: refresh,
		existingState: data,
		processResult: () => {},
		completed: () => optionsRef.value?.block?.max
			|| optionsRef.value?.bundledIn || !refreshSwitch.value
			|| optionsRef.value?.ids && data.value.length === (optionsRef.value?.ids.length || 1)
	})
	
	const fetchAll = async () => {
		while (!status.completed) { await fetchQuery.query() }
		return data
	}
	
	return { state: updateQuery.state, fetchQuery, updateQuery, status, refreshSwitch, fetchAll, on: emitter.on }
}



export function arweaveQueryBlocks (options: Parameters<ReturnType<typeof graphql>['getBlocks']>[0]) { // todo rename to arweaveBlocks and make reactive
	const status = reactive({ completed: false })
	const data = ref([] as GQLBlockEdge[])
	const refresh = 10
	const refreshEnabled = ref(false)
	
	const fetchQuery = getQueryManager({
		name: 'block list fetch',
		query: async () => {
			if (status.completed) { return data.value }
			let results: any
			try {
				const cursor = data.value[data.value.length - 1]?.cursor
				if (!cursor) { results = await graphql().getBlocks(options) }
				else { results = await graphql().getBlocks({ ...options, after: cursor }) }
				if (!results.blocks.pageInfo.hasNextPage) { status.completed = true }
				results = results.blocks.edges
				if (results.length < 10) { status.completed = true } // todo remove??
				if (!data.value.length) { setTimeout(() => refreshEnabled.value = true, refresh * 1000) }
				data.value.push(...results)
			} catch (e) { console.error(e); await new Promise<void>(res => setTimeout(() => res(), 10000)) }
		},
	})
	
	const updateQuery = getAsyncData({
		name: 'block list update',
		awaitEffect: () => !fetchQuery.queryStatus.running && refreshEnabled.value,
		query: async () => {
			let results = (await graphql().getBlocks({ ...options, height: { min: data.value[0].node.height + 1 }, sort: SortOrder.HeightAsc })).blocks.edges
			if (results.length > 0) { data.value.splice(0, 0, ...results.reverse()) }
			return results
		},
		seconds: refresh,
		existingState: data,
		processResult: () => {},
	})
	
	return { state: updateQuery.state, fetchQuery, updateQuery, status }
}



export function queryAggregator (queries: ReturnType<typeof arweaveQuery>[]) {
	const status = reactive({ completed: false, reset: 0 })
	const data = ref([] as { node: any, cursor: string }[])
	const refresh = 10
	const refreshSwitch = ref(true) // todo
	
	let initial = [] as any[]
	let lastAdded = [] as any[]
	
	watch(refreshSwitch, val => queries.forEach(q => q.refreshSwitch.value = val))
	queries.map(query => {
		watch(() => query.updateQuery.stateRef.value, state => {
			if (!state) { return }
			const queryIndex = queries.indexOf(query)
			const index = state.indexOf(initial[queryIndex])
			const newResults = [] as any[]
			for (let i = index - 1; i >= 0; i--) { if (data.value.indexOf(state[i]) < 0) { newResults.push(state[i]) } }
			if (newResults.length) { data.value.splice(0, 0, ...newResults) }
			data.value.sort(blockSort)
		}, { deep: true, flush: 'sync' })
		watch(() => query.status.reset, () => {
			data.value = []
			initial = []
			lastAdded = []
			status.completed = false
			status.reset++
		})
	})
	
	const fetchQuery = getQueryManager({
		name: 'aggregated fetch',
		query: async () => {
			let fulfilled = false
			for (let i = 0; !fulfilled; i++) {
				const queryControls = queries.map(query => {
					const queryIndex = queries.indexOf(query)
					const index = query.updateQuery.stateRef.value?.indexOf(lastAdded[queryIndex]) ?? -1
					const prep = async () => {
						if (index + 1 === query.updateQuery.stateRef.value?.length) { await query.fetchQuery.query() }
						if (!query.updateQuery.stateRef.value?.[index + 1]) { return }
						if (!initial[queryIndex]) { initial[queryIndex] = query.updateQuery.stateRef.value?.[index] }
						if (!initial[queryIndex]?.node.block && query.updateQuery.stateRef.value?.[index]?.node.block) { initial[queryIndex] = query.updateQuery.stateRef.value?.[index] }
						return query.updateQuery.stateRef.value?.[index + 1]
					}
					const step = () => {
						const nextEl = (query.updateQuery.stateRef.value!)[index + 1]
						if (data.value.indexOf(nextEl) < 0) { data.value.push(nextEl) }
						lastAdded[queryIndex] = nextEl
					}
					return { prep, step }
				})
				
				let row = await Promise.all(queryControls.map(q => q.prep()))
				const nextEl = row.find(el => el && el.node.block == null)
					|| row.reduce((acc, el) => el && el.node.block.height > (acc?.node.block.height || 0) ? el : acc, undefined)
				if (!nextEl) { status.completed = true; break }
				if (nextEl.node.block && i >= 10) { fulfilled = true }
				const queryIndex = row.indexOf(nextEl)
				queryControls[queryIndex].step()
			}
			return 'aggregated query fetch completed'
		},
	})
	
	const updateQuery = getAsyncData({
		name: 'aggregated update',
		query: async () => (await Promise.all(queries.map(query => query.updateQuery.getState()))).flat(),
		seconds: refresh,
		existingState: data,
		processResult: () => {},
	})
	
	return { state: updateQuery.state, fetchQuery, updateQuery, status, refreshSwitch }
}


//
// async function refreshTx () {
// 	if (!InterfaceStore.windowVisible) { return }
// 	let requireSort = false
// 	const ids = []
// 	const txs = []
// 	for (const key in ArweaveStore.txs) {
// 		if (!ArweaveStore.txs[key].block) {
// 			ids.push(key)
// 			txs.push(ArweaveStore.txs[key])
// 		}
// 	}
// 	if (ids.length === 0) { return }
// 	const results = await arDB.search().ids(ids).findAll() as GQLEdgeTransactionInterface[]
// 	console.log('updating:', results)
// 	for (const tx of txs) {
// 		const updatedTx = results.find((el) => el?.node?.id === tx.id)?.node
// 		if (updatedTx) {
// 			if (updatedTx.block) { requireSort = true }
// 			Object.assign(tx, updatedTx)
// 		} else {
// 			console.error('tx missing? :0', tx)
// 		}
// 	}
// 	if (requireSort) { sortByBlocks() }
// 	return
// }
//
// function sortByBlocks (wallet?: ArweaveAccount, query?: Query) {
// 	const sort = (a: GQLEdgeTransactionInterface, b: GQLEdgeTransactionInterface) => (b.node.block?.height ?? Number.MAX_SAFE_INTEGER)
// 		- (a.node.block?.height ?? Number.MAX_SAFE_INTEGER)
// 	if (wallet && wallet.queries[query!]) {
// 		wallet.queries[query!].sort(sort)
// 	} else {
// 		for (const key in ArweaveStore.wallets) {
// 			for (const query in ArweaveStore.wallets[key].queries) {
// 				ArweaveStore.wallets[key].queries[query].sort(sort)
// 			}
// 		}
// 	}
// }



const networkInfoData = getAsyncData({
	name: 'network info',
	query: () => arweave.network.getInfo(),
	seconds: 10,
})
watch(() => ArweaveStore.gatewayURL, () => networkInfoData.state.value = undefined)
export const networkInfo = networkInfoData.state


export const currentBlockData = getAsyncData({
	name: 'current block',
	query: () => arweave.blocks.getCurrent(),
	seconds: 60,
	stale: (state) => networkInfoData.stateRef.value && state && networkInfoData.stateRef.value.height > state.height,
	completed: (state) => networkInfoData.stateRef.value && state && networkInfoData.stateRef.value.height == state.height,
})
export const currentBlock = currentBlockData.state



function loadGatewaySettings () {
	updateArweave(ArweaveStore.gatewayURL || gatewayDefault, true)
	updateBundler(ArweaveStore.bundlerURL || bundlerDefault, true)
}
loadGatewaySettings()