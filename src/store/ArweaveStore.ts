import Arweave from 'arweave'
import Transaction from 'arweave/web/lib/transaction'
import ArDB from 'ardb'
import LogoArweave from '@/assets/logos/arweave.svg?component'
import { download } from '@/functions/Utils'
import { decode, encode, getDecryptionKey, getSigningKey } from '@/functions/Crypto'
import { exportTransaction, getFeeRange } from '@/functions/Transactions'
import { awaitEffect, getAsyncData, getQueryManager } from '@/functions/AsyncData'
import { ChannelRef } from '@/functions/Channels'
import { ArweaveVerifier as ArweaveMessageVerifier, ArweaveProviderInterface } from 'arweave-wallet-connector/lib/ArweaveWebWallet'
import { reactive, ref, Ref, toRef, watch } from 'vue'
import type { WalletProxy } from '@/functions/Wallets'
import type { ApiConfig } from 'arweave/web/lib/api'
import type { GQLEdgeTransactionInterface, GQLTransactionInterface } from 'ardb/lib/faces/gql'
import type { TransactionInterface } from 'arweave/web/lib/transaction'
import type { SignatureOptions } from 'arweave/web/lib/crypto/crypto-interface'



const ArweaveStore = reactive({
	gatewayURL: null as null | string,
	gatewayURLObject: null as null | URL,
	wallets: {} as { [key: string]: ArweaveAccount },
	txs: {} as { [key: string]: Partial<GQLTransactionInterface> },
	uploads: {} as { [key: string]: { upload?: number } },
})

export default ArweaveStore
export let arweave: Arweave
export let arDB: { search: InstanceType<typeof ArDB>['search'] }



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
	arDB = { search: (...args) => new ArDB(arweave).search(...args) }
	ArweaveStore.gatewayURL = settingsToUrl(arweave.getConfig().api)
	ArweaveStore.gatewayURLObject = new URL(ArweaveStore.gatewayURL)
}

export function useWatchTx (txId: Ref<string>) {
	const getTxById = (txId: string) => getAsyncData({
		existingState: toRef(ArweaveStore.txs, txId),
		query: async () => (await arDB.search().id(txId).find() as GQLEdgeTransactionInterface[])[0].node,
		completed: () => ArweaveStore.txs[txId]?.block,
		processResult: res => Object.assign(ArweaveStore.txs[txId] ??= {}, res),
		seconds: 10,
	})
	const data: { value?: ReturnType<typeof getTxById>['state'] } = reactive({})
	let destructor: () => any | undefined
	watch(txId, id => {
		destructor?.()
		const handler = getTxById(id)
		data.value = handler.state
		destructor = handler.stop
	}, { immediate: true })
	return toRef(data, 'value') as Ref<Partial<GQLTransactionInterface>>
}

export async function fetchPublicKey (address: string) {
	const tx = await arDB.search().from(address).find() as GQLEdgeTransactionInterface[]
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
		const received = arweaveQuery({ target: this.key })
		const sent = arweaveQuery({ owner: this.key })
		const all = queryAggregator([received, sent])
		this.queries = { all, received, sent }
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
		if (!this.#wallet.data.jwk) { return exportTransaction(tx) }
		if (tx.owner && tx.owner !== await this.getPublicKey()) { throw 'error' }
		await arweave.transactions.sign(tx, await this.#wallet.getPrivateKey!(), options)
		return tx
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
		if (!this.#wallet.signTransaction) { throw 'error' }
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



const blockSort = (a: GQLEdgeTransactionInterface, b: GQLEdgeTransactionInterface) => (b.node.block?.height ?? Number.MAX_SAFE_INTEGER)
	- (a.node.block?.height ?? Number.MAX_SAFE_INTEGER)



function newArdb (query: QueryOptions) {
	const ardb = new ArDB(arweave).search()
	if (query.ids) { ardb.ids(query.ids) }
	if (query.owner) { ardb.from(query.owner) }
	if (query.target) { ardb.to(query.target) }
	if (query.block?.min) { ardb.min(query.block.min) }
	if (query.block?.max) { ardb.max(query.block.max) }
	for (const tag in query.tags) { ardb.tag(tag, query.tags[tag]) }
	return ardb
}



export function arweaveQuery (query: QueryOptions) {
	const status = reactive({ completed: false })
	const data = ref([] as GQLEdgeTransactionInterface[])
	const refresh = 10
	const refreshEnabled = ref(false)

	const fetchQuery = getQueryManager({
		query: async () => {
			if (status.completed) { return data.value }
			const ardbFetch = newArdb(query)
			let fulfilled = false
			let results: any
			try {
				const firstFetch = !data.value.length
				for (let i = 0; !fulfilled; i++) {
					if (i === 0 && firstFetch) {
						results = await ardbFetch.find() as GQLEdgeTransactionInterface[]
					} else {
						const cursor = data.value[data.value.length - 1].cursor
						results = await ardbFetch.cursor(cursor).find() as GQLEdgeTransactionInterface[]
					}
					if (results.length < 10) { status.completed = true; fulfilled = true }
					if (results[results.length - 1]?.node.block) { fulfilled = true }
					data.value.push(...results)
				}
				if (firstFetch) { setTimeout(() => refreshEnabled.value = true, refresh * 1000) }
			}
			catch (e) { console.error(e); await new Promise<void>(res => setTimeout(() => res(), 10000)) }
		},
	})
	
	const updateQuery = getAsyncData({
		awaitEffect: () => !fetchQuery.queryStatus.running && data.value.length && refreshEnabled.value,
		query: async () => {
			const ardbUpdate = newArdb(query)
			let requireSort = false
			let fulfilled = false
			let results: any
			for (let i = 0; !fulfilled; i++) {
				if (i === 0) { results = await ardbUpdate.find() as GQLEdgeTransactionInterface[] }
				else {
					if (!results) { return }
					const cursor = results[results.length - 1].cursor
					results = await ardbUpdate.cursor(cursor).find() as GQLEdgeTransactionInterface[]
				}
				if (results.length < 10) { status.completed = true; fulfilled = true }
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
	})
	
	return { state: updateQuery.state, fetchQuery, updateQuery, status }
}



export function queryAggregator (queries: ReturnType<typeof arweaveQuery>[]) {
	const status = reactive({ completed: false })
	const data = ref([] as GQLEdgeTransactionInterface[])
	const refresh = 10
	
	const initial = [] as any[]
	const lastAdded = [] as any[]
	
	queries.map(query => watch(() => query.updateQuery.stateRef.value, state => {
		if (!state) { return }
		const queryIndex = queries.indexOf(query)
		const index = state.indexOf(initial[queryIndex])
		const newResults = [] as any[]
		for (let i = index - 1; i >= 0; i--) { if (data.value.indexOf(state[i]) < 0) { newResults.push(state[i]) } }
		if (newResults.length) { data.value.splice(0, 0, ...newResults) }
		data.value.sort(blockSort)
	}, { deep: true, flush: 'sync' }))
	
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

function processUpdatedTxs () {
	// TODO
	// take tx array from update function that were not already known
	// check if wallets with cached balance are involved
}





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