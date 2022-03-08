import Arweave from 'arweave'
import Transaction from 'arweave/web/lib/transaction'
import arweaveGraphql, { SortOrder } from 'arweave-graphql'
import LogoArweave from '@/assets/logos/arweave.svg?component'
import { download } from '@/functions/Utils'
import { getDecryptionKey, getSigningKey } from '@/functions/Crypto'
import { exportTransaction, manageUpload } from '@/functions/Transactions'
import { awaitEffect, getAsyncData, getReactiveAsyncData, getQueryManager } from '@/functions/AsyncData'
import { ArweaveProviderInterface, ArweaveVerifier as ArweaveMessageVerifier } from 'arweave-wallet-connector/lib/ArweaveWebWallet'
import { computed, isRef, reactive, ref, Ref, watch } from 'vue'
import axios from 'axios'
import type { WalletProxy } from '@/functions/Wallets'
import type { TransactionEdge as GQLTransactionEdge, BlockEdge as GQLBlockEdge } from 'arweave-graphql'
import type { ApiConfig } from 'arweave/web/lib/api'
import type { TransactionInterface } from 'arweave/web/lib/transaction'
import type { SignatureOptions } from 'arweave/web/lib/crypto/crypto-interface'



const ArweaveStore = reactive({
	gatewayURL: null as null | string,
	gatewayURLObject: null as null | URL,
	wallets: {} as { [key: string]: ArweaveAccount },
	txs: {} as { [key: string]: any },
	uploads: {} as { [key: string]: { upload?: number } },
})

export default ArweaveStore
export let arweave: Arweave



export const gatewayDefault = {
	host: 'arweave.net',
	port: 443,
	protocol: 'https'
}

export function urlToSettings (url: string) {
	if (!url.includes('://')) { url = 'https://' + url }
	const obj = new URL(url)
	const protocol = obj.protocol.replace(':', '')
	const host = obj.hostname
	const port = obj.port ? parseInt(obj.port) : protocol === 'https' ? 443 : 80
	return { protocol, host, port }
}

export function settingsToUrl (settings: URL | ApiConfig) {
	return `${settings.protocol}://${settings.host}:${settings.port}/`
}

export async function testGateway (gateway: string | URL | ApiConfig) {
	const settings = typeof gateway === 'string' ? urlToSettings(gateway) : gateway
	const arweaveTest = Arweave.init(settings)
	try {
		const net = await arweaveTest.network.getInfo()
		if (net) { return true }
	} catch (e) { }
	return false
}

export function updateArweave (gateway: string | URL | ApiConfig) {
	const settings = typeof gateway === 'string' ? urlToSettings(gateway) : gateway
	arweave = settings ? Arweave.init(settings) : Arweave.init(gatewayDefault)
	ArweaveStore.gatewayURL = settingsToUrl(arweave.getConfig().api)
	ArweaveStore.gatewayURLObject = new URL(ArweaveStore.gatewayURL)
}

export function useWatchTx (txId: Ref<string | undefined>) {
	return getReactiveAsyncData({
		params: txId,
		query: async (txId) => (await graphql().getTransactions({ ids: [txId] })).transactions.edges[0]?.node,
		completed: (state: any) => state?.block,
		seconds: 10,
	})
}

export async function fetchPublicKey (address: string) {
	const tx = (await graphql().getTransactions({ owners: [address] })).transactions.edges
	return tx?.[0]?.node.owner.key
}



export class ArweaveAccount implements Account {
	get metadata () { return {
		name: 'Arweave Address',
		icon: LogoArweave,
	}}
	state = reactive({
		key: undefined as undefined | string,
	})
	get key () {
		if (typeof this.init === 'string') { return this.init }
		else if (typeof this.init === 'object') { return this.init.data.arweave?.key }
	}
	#balance = getAsyncData({
		awaitEffect: () => this.key,
		query: async () => arweave.ar.winstonToAr(await arweave.wallets.getBalance(this.key!)),
		seconds: 600,
	})
	get balance () { return this.#balance.state.value }
	queries
	
	constructor (private init: string | WalletProxy) {
		const received = arweaveQuery(computed(() => (this.key ? { recipients: [this.key] } : undefined)))
		const sent = arweaveQuery(computed(() => (this.key ? { owners: [this.key] } : undefined )))
		const all = queryAggregator([received, sent])
		this.queries = [
			{ query: all, name: 'All', color: 'var(--orange)' }, // todo name and color in metadata object
			{ query: received, name: 'Received', color: 'var(--green)' },
			{ query: sent, name: 'Sent', color: 'var(--red)' },
		]
	}
	destructor () { this.#balance.stop() }
}



export class ArweaveProvider extends ArweaveAccount implements Provider {
	static get metadata (): StaticMetadata { return {
		name: 'Arweave Address',
		icon: LogoArweave,
		isSupported: true,
		isProviderFor: (walletProxy) => !!walletProxy.data.jwk,
		addImportData: async (walletData) => {
			const address = await arweave.wallets.jwkToAddress(walletData.jwk)
			walletData.arweave ??= {}
			walletData.arweave.key = address
		},
	}}
	get metadata () { return {
		...ArweaveProvider.metadata,
		name: this.#wallet.data.jwk ? 'Arweave Wallet' : 'Arweave Address',
		methods: {
			download: { unavailable: !this.#wallet.data.jwk },
			signTransaction: { userIntent: !this.#wallet.data.jwk },
			bundle: { unavailable: !this.#wallet.data.jwk },
			sign: { unavailable: !this.#wallet.data.jwk },
			decrypt: { unavailable: !this.#wallet.data.jwk },
		}
	}}
	#wallet: WalletProxy
	messageVerifier: ArweaveMessageVerifier
	messageRunner: ArweaveMessageRunner
	constructor (init: WalletProxy) {
		super(init)
		if (!init.data.arweave?.key && init.data.jwk) { ArweaveProvider.metadata.addImportData(init.data) }
		this.#wallet = init
		this.messageVerifier = new ArweaveMessageVerifier()
		this.messageRunner = new ArweaveMessageRunner(this)
	}
	get id () { return this.#wallet.id }
	get uuid () { return this.#wallet.uuid }
	async signTransaction (tx: Transaction, options?: SignatureOptions) {
		// todo test balance
		if (!this.#wallet.data.jwk) { return exportTransaction(tx) }
		if (tx.owner && tx.owner !== await this.getPublicKey()) { throw 'error' }
		await arweave.transactions.sign(tx, await this.#wallet.getPrivateKey!(), options)
		return tx
	}
	async bundle (tx: Transaction, options?: object) {
		const { createData, signers } = await import('@/../scripts/bundle')
		const data = tx.get('data', { decode: true, string: false })
		const tags = tx.tags.map(tag => ({
			name: tag.get('name', { decode: true, string: true }),
			value: tag.get('value', { decode: true, string: true })
		}))
		const signer = new signers.ArweaveSigner(await this.#wallet.getPrivateKey!())
		const anchor = arweave.utils.bufferTob64(crypto.getRandomValues(new Uint8Array(32))).slice(0, 32)
		const bundleTx = createData(data, signer, { tags, anchor })
		await bundleTx.sign(signer)
		const res = await axios.post('https://node2.bundlr.network/tx', bundleTx.getRaw(), {
			headers: { "Content-Type": "application/octet-stream" },
			maxBodyLength: Infinity,
		})
		console.log(res, bundleTx)
		if (res.status >= 200 && res.status < 300) { return { id: bundleTx.id } }
		throw new Error(res.status + '')
	}
	async sign (data: ArrayBufferView, options: Parameters<ArweaveProviderInterface['sign']>[1]) {
		const signingKey = await getSigningKey(await this.#wallet.getPrivateKey!() as JsonWebKey)
		const signed = await window.crypto.subtle.sign(options, signingKey, data)
		return new Uint8Array(signed)
	}
	async decrypt (data: ArrayBufferView, options: Parameters<ArweaveProviderInterface['decrypt']>[1]) {
		const decryptionKey = await getDecryptionKey(await this.#wallet.getPrivateKey!() as JsonWebKey)
		const decrypted = await window.crypto.subtle.decrypt(options, decryptionKey, data)
		return new Uint8Array(decrypted)
	}
	async getPublicKey () {
		if (this.#wallet.getPrivateKey) { return (await this.#wallet.getPrivateKey()).n }
		await awaitEffect(() => this.key)
		return fetchPublicKey(this.key!)
	}
	async download () {
		await awaitEffect(() => this.key)
		download(this.key!, JSON.stringify(await this.#wallet.getPrivateKey!()))
	}
}



export class ArweaveMessageRunner implements MessageRunner, Partial<ArweaveProviderInterface> {
	#wallet: ArweaveProvider
	constructor (wallet: ArweaveProvider) {
		this.#wallet = wallet
	}
	getMethodMetadata (method: string) {
		const map: { [keys in keyof this]?: keyof Metadata<ArweaveProvider>['methods'] } = {
			signTransaction: 'signTransaction',
			dispatch: 'bundle',
			getPublicKey: 'getPublicKey',
			sign: 'sign',
			decrypt: 'decrypt',
		}
		const providerMethod = map[method as keyof this]
		if (!providerMethod) { return }
		const methods = this.#wallet.metadata?.methods
		return methods?.[providerMethod as keyof typeof methods]
	}
	async signTransaction (tx: TransactionInterface, options?: object) {
		const txObject = new Transaction(tx)
		// const fee = await getFeeRange()
		// if (fee.default?.gt(txObject.reward)) { txObject.reward = fee.default.toString() }
		await this.#wallet.signTransaction(txObject)
		return {
			id: txObject.id,
			owner: txObject.owner,
			tags: txObject.tags,
			signature: txObject.signature,
			reward: txObject.reward
		}
	}
	async dispatch (tx: TransactionInterface, options?: object) {
		// todo do not store large data in indexeddb
		const txObject = new Transaction(tx)
		let dispatchResult: Awaited<ReturnType<ArweaveProviderInterface['dispatch']>> | undefined
		try {
			const res = await this.#wallet.bundle(txObject)
			dispatchResult = { id: res.id, type: 'BUNDLED' }
		} catch (e) { console.error(e) }
		if (dispatchResult) { return dispatchResult }
		try {
			await this.#wallet.signTransaction(txObject)
			// manageUpload(txObject)
			dispatchResult = { id: txObject.id, type: 'BASE' }
		} catch (e) { console.error(e) }
		if (dispatchResult) { return dispatchResult }
		throw 'testing without base tx fallback'
	}
	async getPublicKey () {
		const publicKey = await this.#wallet.getPublicKey()
		if (!publicKey) { throw 'error' }
		return publicKey
	}
	async sign (message: ArrayBufferView, options: Parameters<ArweaveProviderInterface['sign']>[1]) {
		if (message.byteLength === 48) { throw 'error' }
		return this.#wallet.sign!(message, options)
	}
	async decrypt (message: ArrayBufferView, options: Parameters<ArweaveProviderInterface['decrypt']>[1]) {
		return this.#wallet.decrypt!(message, options)
	}
	async getArweaveConfig () {
		const config = arweave.getConfig().api
		return { protocol: config.protocol, host: config.host, port: config.port }
	}
}



const blockSort = (a: GQLTransactionEdge, b: GQLTransactionEdge) => (b.node.block?.height ?? Number.MAX_SAFE_INTEGER)
	- (a.node.block?.height ?? Number.MAX_SAFE_INTEGER)

export const graphql = () => arweaveGraphql((ArweaveStore.gatewayURL || 'https://arweave.net/') + 'graphql')



type arweaveQueryOptions = Parameters<ReturnType<typeof graphql>['getTransactions']>[0] | Ref<Parameters<ReturnType<typeof graphql>['getTransactions']>[0]>

export function arweaveQuery (options: arweaveQueryOptions) { // todo rename to arweaveTransactions
	const optionsRef = isRef(options) ? options : ref(options)
	const status = reactive({ completed: false, reset: 0 })
	const data = ref([] as GQLTransactionEdge[])
	const refresh = 10
	const refreshEnabled = ref(false)
	const refreshSwitch = ref(true) // todo
	
	watch(optionsRef, () => {
		status.completed = false
		data.value = []
		refreshEnabled.value = false
		status.reset++
	}, { deep: true })
	
	const fetchQuery = getQueryManager({
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
			return results
		},
	})
	
	const updateQuery = getAsyncData({
		awaitEffect: () => !fetchQuery.queryStatus.running && refreshEnabled.value,
		query: async () => {
			let requireSort = false
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
				if (results.length < 10) { status.completed = true; fulfilled = true } // todo remove??
				const resultsFiltered = []
				for (const result of results) {
					const matchingTx = data.value.find(el => el.node.id === result.node.id)
					if (matchingTx) {
						if (matchingTx.node.block) { fulfilled = true }
						else if (result.node.block) { Object.assign(matchingTx, result); requireSort = true }
					} else {
						resultsFiltered.push(result)
						if (result.node.block) { requireSort = true }
					}
				}
				if (resultsFiltered.length > 0) { data.value.splice(0, 0, ...resultsFiltered) }
				if (requireSort) { data.value.sort(blockSort); requireSort = false }
			}
			return results
		},
		seconds: refresh,
		existingState: data,
		processResult: () => {},
		completed: () => optionsRef.value?.block?.max || optionsRef.value?.bundledIn || !refreshSwitch.value
	})
	
	const setRefresh = (b: any) => refreshSwitch.value = !!b
	
	return { state: updateQuery.state, fetchQuery, updateQuery, status, setRefresh }
}



export function arweaveQueryBlocks (options: Parameters<ReturnType<typeof graphql>['getBlocks']>[0]) { // todo rename to arweaveBlocks and make reactive
	const status = reactive({ completed: false })
	const data = ref([] as GQLBlockEdge[])
	const refresh = 10
	const refreshEnabled = ref(false)
	
	const fetchQuery = getQueryManager({
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
	
	let initial = [] as any[]
	let lastAdded = [] as any[]
	
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
			status.reset++
		})
	})
	
	const fetchQuery = getQueryManager({
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
		query: async () => (await Promise.all(queries.map(query => query.updateQuery.getState()))).flat(),
		seconds: refresh,
		existingState: data,
		processResult: () => {},
	})
	
	return { state: updateQuery.state, fetchQuery, updateQuery, status }
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
	query: () => arweave.network.getInfo(),
	seconds: 10,
})
watch(() => ArweaveStore.gatewayURL, () => networkInfoData.state.value = undefined)
export const networkInfo = networkInfoData.state


export const currentBlockData = getAsyncData({
	query: () => arweave.blocks.getCurrent(),
	seconds: 60,
	stale: (state) => networkInfoData.stateRef.value && state && networkInfoData.stateRef.value.height > state.height,
	completed: (state) => networkInfoData.stateRef.value && state && networkInfoData.stateRef.value.height == state.height,
})
export const currentBlock = currentBlockData.state



function loadGatewaySettings () {
	updateArweave(localStorage.getItem('gateway') || gatewayDefault)
}



loadGatewaySettings()

window.addEventListener('storage', (e) => {
	if (e.newValue === e.oldValue) { return }
	else if (e.key === 'gateway') { loadGatewaySettings() }
})