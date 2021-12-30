import Arweave from 'arweave'
import ArDB from 'ardb'
import { download } from '@/functions/Utils'
import axios from 'axios'
import { computed, reactive, toRef, watch } from 'vue'
import InterfaceStore from '@/store/InterfaceStore'
import LogoArweave from '@/assets/logos/arweave.svg?component'
import { ApiConfig } from 'arweave/web/lib/api'
import { GQLEdgeTransactionInterface, GQLTransactionInterface } from 'ardb/lib/faces/gql'
import Transaction, { TransactionInterface } from 'arweave/web/lib/transaction'
import { SignatureOptions } from 'arweave/web/lib/crypto/crypto-interface'
import { ArweaveVerifier, ArweaveProviderInterface } from 'arweave-wallet-connector/lib/ArweaveWebWallet'
import { decode, encode, getDecryptionKey, getSigningKey } from '@/functions/Crypto'
import { getFeeRange } from '@/functions/Transactions'
import { awaitEffect, getAsyncData } from '@/functions/AsyncData'
import { Channel } from '@/functions/Channels'



const ArweaveStore = reactive({
	gatewayURL: null as null | string,
	wallets: {} as { [key: string]: ArweaveAccount },
	txs: {} as { [key: string]: Partial<GQLTransactionInterface> },
	uploads: {} as { [key: string]: { upload?: number } },
})

export default ArweaveStore
export let arweave: Arweave
export let arDB: { search: InstanceType<typeof ArDB>['search'] }



const gatewayDefault = {
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
}

export function getTxById (txId: string) {
	return getAsyncData({
		existingState: toRef(ArweaveStore.txs, txId),
		query: async () => (await arDB.search().id(txId).find() as GQLEdgeTransactionInterface[])[0].node,
		completed: () => ArweaveStore.txs[txId]?.block,
		processResult: res => Object.assign(ArweaveStore.txs[txId] ??= {}, res),
		seconds: 10,
	}).state
}

export async function fetchPublicKey (address: string) {
	const tx = await arDB.search().from(address).find() as GQLEdgeTransactionInterface[]
	return tx?.[0]?.node.owner.key
}





// TODO function fetchQuery and fetchQueries to stitch txs



export class ArweaveAccount implements Account {
	state = reactive({
		key: undefined as undefined | string,
	})
	#balance = getAsyncData({
		query: async () => arweave.ar.winstonToAr(await arweave.wallets.getBalance(this.key!)),
		awaitEffect: () => this.key,
		seconds: 600,
	})
	queries = reactive({} as { [key: string]: GQLEdgeTransactionInterface[] })
	queriesStatus = reactive({} as { [key: string]: QueryStatusInterface })
	
	constructor (init: string | WalletDataInterface) {
		if (typeof init === 'string') { this.state.key = init }
		else if (typeof init === 'object') {
			if (init.arweave?.key) { this.state.key = init.arweave.key }
			else if (init.jwk) { arweave.wallets.jwkToAddress(init.jwk).then((address) => {
				this.state.key = address
				init.arweave ??= {}
				init.arweave.key = address
			})}
		}
	}
	
	get key () { return this.state.key }
	get balance () { return this.#balance.state.value }
	
	fetchTransactions = async (query: Query) => fetchTransactions(this, query)
	updateTransactions = async (query: Query) => updateTransactions(this, query)
}



export class ArweaveProvider extends ArweaveAccount implements Provider {
	#wallet: WalletDataInterface
	static isProviderFor (wallet: WalletDataInterface) { return !!wallet.jwk }
	constructor (init: WalletDataInterface) {
		super(init)
		this.#wallet = init
		if (!init.jwk) {
			const disabled = ['download', 'signTransaction', 'sign', 'decrypt'] as const
			disabled.forEach(method => this[method] = undefined)
		}
	}
	get metadata () { return {
		isSupported: true,
		name: this.#wallet.jwk ? 'Arweave Wallet' : 'Arweave Address',
		icon: LogoArweave,
	}}
	async signTransaction? (tx: Transaction, options?: SignatureOptions) {
		if (tx.owner && tx.owner !== await this.getPublicKey()) { throw 'error' }
		await arweave.transactions.sign(tx, this.#wallet.jwk, options)
		return tx
	}
	async sign? (data: ArrayBufferView, options: Parameters<ArweaveProviderInterface['sign']>[1]) {
		const signed = await window.crypto.subtle.sign(options, await getSigningKey(this.#wallet.jwk as JsonWebKey), data)
		return new Uint8Array(signed)
	}
	async decrypt? (data: ArrayBufferView, options: Parameters<ArweaveProviderInterface['decrypt']>[1]) {
		const decrypted = await window.crypto.subtle.decrypt(options, await getDecryptionKey(this.#wallet.jwk as JsonWebKey), data)
		return new Uint8Array(decrypted)
	}
	async getPublicKey () { return this.#wallet.jwk?.n || await awaitEffect(() => this.key) && fetchPublicKey(this.key!) || undefined }
	async download? () {
		const key = this.key ? this.key : await arweave.wallets.jwkToAddress(this.#wallet.jwk)
		download(key, JSON.stringify(this.#wallet.jwk))
	}
	verifyMessage (message: Message | string) {
		const verifier = new ArweaveVerifier()
		const apiToObject: { [key in keyof ArweaveAPI]?: keyof ArweaveProvider } = {
			signTransaction: 'signTransaction',
			getPublicKey: 'getPublicKey',
			sign: 'sign',
			decrypt: 'decrypt',
		}
		// @ts-ignore
		if (typeof message === 'string') { return !!verifier[message] && (apiToObject[message] ? this[apiToObject[message]] : true) }
		// @ts-ignore
		return verifier[message.method]?.(...(message.params || [])) || false
	}
	async runMessage (message: Message) {
		if (!this.verifyMessage(message)) { throw 'params changed and are not valid anymore' }
		const runner = new ArweaveAPI(this)
		// @ts-ignore
		return runner[message.method]?.(...(message.params || []))
	}
}



export class ArweaveAPI implements ArweaveProviderInterface {
	#wallet: ArweaveProvider
	
	constructor (wallet: ArweaveProvider) { this.#wallet = wallet }
	
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



async function fetchTransactions (wallet: ArweaveAccount, query: Query) {
	if ((wallet.queriesStatus[query] ??= {}).completed) { return }
	await awaitEffect(() => wallet.key && !wallet.queriesStatus[query]?.fetch)
	wallet.queriesStatus[query].fetch = true
	if (query === 'all') {
		try { await fetchTransactionsAll(wallet) }
		catch (e) { console.error(e) }
		wallet.queriesStatus[query].fetch = false
		return
	}
	let fulfilled = false
	let results: GQLEdgeTransactionInterface[]
	const queries = {
		received: () => arDB.search().to(wallet.key!),
		sent: () => arDB.search().from(wallet.key!),
	}
	try {
		for (let i = 0; !fulfilled; i++) {
			if (!wallet.queries[query]) {
				results = await queries[query]().find() as any
			} else {
				const lastTxIndex = wallet.queries[query].length - 1
				const cursor = wallet.queries[query][lastTxIndex].cursor
				results = await queries[query]().cursor(cursor).find() as any
			}
			for (const result of results) {
				result.node = Object.assign(ArweaveStore.txs[result.node.id] ??= {}, result.node)
			}
			if (results.length < 10) {
				wallet.queriesStatus[query].completed = true
				console.log('completed')
				fulfilled = true
			}
			if (results[results.length - 1]?.node.block) { fulfilled = true }
			(wallet.queries[query] ??= []).push(...results)
		}
	}
	catch (e) { console.error(e) }
	finally { wallet.queriesStatus[query].fetch = false }
}

async function fetchTransactionsAll (wallet: ArweaveAccount) {
	wallet.queries.all ??= []
	const stopCondition = () => {
		return (wallet.queriesStatus.received?.completed || wallet.queriesStatus.all.received?.node.block)
			&& (wallet.queriesStatus.sent?.completed || wallet.queriesStatus.all.sent?.node.block)
	}
	for (let i = 0; i < 10 || !stopCondition(); i++) {
		const queries: Query[] = ['received', 'sent']
		const nextTx = {} as { [key in Query]: GQLEdgeTransactionInterface }
		const fetchPromises = []
		for (const query of queries) {
			const fetch = async () => {
				if (!wallet.queries[query]) { await fetchTransactions(wallet, query) }
				const index = wallet.queries[query].indexOf(wallet.queriesStatus.all[query]!)
				if (wallet.queries[query].length - index < 3) { await fetchTransactions(wallet, query) }
				nextTx[query] = wallet.queries[query][index + 1]
			}
			fetchPromises.push(fetch())
		}
		await Promise.all(fetchPromises)
		if (nextTx.received && (
			nextTx.received.node.block == null ||
			nextTx.received.node.block.height >= (nextTx.sent ? nextTx.sent.node.block?.height ?? Number.MAX_SAFE_INTEGER : -1)
		)) {
			wallet.queriesStatus.all.received = nextTx.received
			wallet.queries.all.push(nextTx.received)
		}
		if (nextTx.sent && (
			nextTx.sent.node.block == null ||
			nextTx.sent.node.block.height >= (nextTx.received ? nextTx.received.node.block?.height ?? Number.MAX_SAFE_INTEGER : -1)
		)) {
			wallet.queriesStatus.all.sent = nextTx.sent
			wallet.queries.all.push(nextTx.sent)
		}
		wallet.queriesStatus.all.completed = wallet.queriesStatus.received.completed && wallet.queriesStatus.sent.completed
			&& wallet.queries.all.length === wallet.queries.received.length + wallet.queries.sent.length
	}
	return new Promise<void>(resolve => setTimeout(() => resolve(), 10))
}

async function updateTransactions (wallet: ArweaveAccount, query: Query) {
	if (!wallet.queries[query] || wallet.queries[query].length === 0) { return fetchTransactions(wallet, query) }
	if (wallet.queriesStatus[query]?.fetch) { return }
	await awaitEffect(() => wallet.key && !wallet.queriesStatus[query]?.update)
	wallet.queriesStatus[query].update = true
	await awaitEffect(() => InterfaceStore.windowVisible)
	if (query === 'all') {
		await updateTransactionsAll(wallet)
		wallet.queriesStatus[query].update = false
		return
	}
	let requireSort = false
	let fulfilled = false
	let results: GQLEdgeTransactionInterface[]
	const queries = {
		received: () => arDB.search().to(wallet.key!),
		sent: () => arDB.search().from(wallet.key!),
	}
	const resultsFiltered = []
	try {
		results = await queries[query]().find() as GQLEdgeTransactionInterface[] // Todo - Use the number of pending txs as minimum
		for (let i = 0; !fulfilled; i++) {
			if (i !== 0) {
				const lastTxIndex = results.length - 1
				const cursor = results[lastTxIndex].cursor
				results = await queries[query]().cursor(cursor).find() as GQLEdgeTransactionInterface[]
			}
			if (results.length < 10) {
				wallet.queriesStatus[query].completed = true
				fulfilled = true
			}
			for (const result of results) {
				const matchingTx = wallet.queries[query].find(el => el.node.id === result.node.id)
				if (matchingTx) {
					matchingTx.cursor = result.cursor
					if (matchingTx.node.block) { fulfilled = true }
					else if (result.node.block) { requireSort = true }
				} else {
					resultsFiltered.push(result)
					if (result.node.block) { requireSort = true }
				}
				result.node = Object.assign(ArweaveStore.txs[result.node.id] ??= {}, result.node)
			}
		}
		if (resultsFiltered.length > 0) { wallet.queries[query].splice(0, 0, ...resultsFiltered) }
		if (requireSort) { sortByBlocks() }
	}
	catch (e) { console.error(e) }
	finally { wallet.queriesStatus[query].update = false }
}

async function updateTransactionsAll (wallet: ArweaveAccount) {
	const fetchPromises = []
	const newTxs = [] as GQLEdgeTransactionInterface[]
	const queries: Query[] = ['received', 'sent']
	for (const query of queries) {
		const fetch = async () => {
			await updateTransactions(wallet, query)
			for (const [index, tx] of wallet.queries[query].entries()) {
				if (
					index < wallet.queries[query].indexOf(wallet.queriesStatus.all[query]!)
					&& !wallet.queries.all.find((el) => el.node.id === tx.node.id)
				) { newTxs.push(tx) }
			}
		}
		fetchPromises.push(fetch())
	}
	await Promise.all(fetchPromises)
	if (newTxs.length) {
		wallet.queries.all.splice(0, 0, ...newTxs)
		sortByBlocks(wallet, 'all')
	}
}

async function refreshTx () {
	if (!InterfaceStore.windowVisible) { return }
	let requireSort = false
	const ids = []
	const txs = []
	for (const key in ArweaveStore.txs) {
		if (!ArweaveStore.txs[key].block) {
			ids.push(key)
			txs.push(ArweaveStore.txs[key])
		}
	}
	if (ids.length === 0) { return }
	const results = await arDB.search().ids(ids).findAll() as GQLEdgeTransactionInterface[]
	console.log('updating:', results)
	for (const tx of txs) {
		const updatedTx = results.find((el) => el?.node?.id === tx.id)?.node
		if (updatedTx) {
			if (updatedTx.block) { requireSort = true }
			Object.assign(tx, updatedTx)
		} else {
			console.error('tx missing? :0', tx)
		}
	}
	if (requireSort) { sortByBlocks() }
	return
}

function sortByBlocks (wallet?: ArweaveAccount, query?: Query) {
	const sort = (a: GQLEdgeTransactionInterface, b: GQLEdgeTransactionInterface) => (b.node.block?.height ?? Number.MAX_SAFE_INTEGER)
		- (a.node.block?.height ?? Number.MAX_SAFE_INTEGER)
	if (wallet && wallet.queries[query!]) {
		wallet.queries[query!].sort(sort)
	} else {
		for (const key in ArweaveStore.wallets) {
			for (const query in ArweaveStore.wallets[key].queries) {
				ArweaveStore.wallets[key].queries[query].sort(sort)
			}
		}
	}
}

function processUpdatedTxs () {
	// TODO
	// take tx array from update function that were not already known
	// check if wallets with cached balance are involved
}




export const currency = getConversion()

function getConversion () {
	const settings = new Channel('currency', undefined, { currency: 'USD', provider: 'redstone' }).state
	const currentPrice = getAsyncData({
		existingState: toRef(settings, 'rate'),
		timestamp: toRef(settings, 'timestamp'),
		query: async () => {
			const currency = settings.currency
			const provider = settings.provider
			if (provider === 'redstone') {
				if (currency === 'USD') {
					const result = await axios.get('https://api.redstone.finance/prices/?symbols=AR&provider=redstone')
					return result.data['AR'].value
				} else {
					const result = await axios.get('https://api.redstone.finance/prices/?symbols=AR,' + currency + '&provider=redstone')
					return result.data['AR'].value / result.data[currency!].value
				}
			}
		},
		seconds: 600,
	}).state
	watch(() => [settings.currency, settings.provider], () => settings.rate = undefined)
	const symbol = computed(() => new Intl.NumberFormat([...navigator.languages], { style: 'currency', currency: settings.currency }).format(0).replace(/[\w\d\.\,\s]/g, '') || '$')
	return { currentPrice, settings, symbol }
}

export const { state: redstoneOptions } = getAsyncData({
	query: async () => {
		type currencyOptions = { value: { currency: string, provider: string }, text: string }[]
		const options = [] as currencyOptions
		const res = (await axios.get('https://api.redstone.finance/configs/tokens')).data
		const message = ' Redstone Finance'
		options.push({ value: { currency: 'USD', provider: 'redstone' }, text: 'USD' + message })
		for (const key in res) {
			if (res[key].tags?.includes('currencies')) { options.push({ value: { currency: key, provider: 'redstone' }, text: key + message }) }
		}
		return options
	},
	seconds: 86400,
})




export const { state: networkInfo, getState: getNetworkInfo } = getAsyncData({
	query: () => arweave.network.getInfo(),
	seconds: 10,
})
watch(() => ArweaveStore.gatewayURL, () => networkInfo.value = undefined)





function loadGatewaySettings () {
	updateArweave(localStorage.getItem('gateway') || gatewayDefault)
}



loadGatewaySettings()

window.addEventListener('storage', (e) => {
	if (e.newValue === e.oldValue) { return }
	else if (e.key === 'gateway') { loadGatewaySettings() }
})