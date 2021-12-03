import Arweave from 'arweave/web'
import ArDB from 'ardb'
import { awaitEffect } from '@/functions/Utils'
import axios from 'axios'
import { computed, reactive, ref, watch } from 'vue'
import InterfaceStore, { sleepUntilVisible } from '@/store/InterfaceStore'

import { ApiConfig } from 'arweave/web/lib/api'
import { GQLEdgeTransactionInterface, GQLTransactionInterface } from 'ardb/lib/faces/gql'



const ArweaveStore = reactive({
	gatewayURL: null as null | string,
	wallets: {} as { [key: string]: ArweaveAccount },
	txs: {} as { [key: string]: Partial<GQLTransactionInterface> },
	conversion: {
		currentPrice: null as null | number,
		isUpdating: false,
		settings: { currency: 'USD', provider: 'redstone' },
	},
	uploads: {},
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

export async function getTxById (txId: string) {
	if (ArweaveStore.txs[txId]?.block) { return }
	await sleepUntilVisible()
	const result = (await arDB.search().id(txId).find() as GQLEdgeTransactionInterface[])[0]
	if (!result) { return }
	Object.assign(ArweaveStore.txs[result.node.id] ??= {}, result.node)
}







type Query = 'received' | 'sent' | 'all'
type QueryStatusInterface = {
	completed?: boolean
	fetch?: boolean
	update?: boolean
	cursor?: string // TODO
	promise?: Promise<GQLEdgeTransactionInterface[]> // TODO
} & {
	[key in Query]?: GQLEdgeTransactionInterface // TODO make it a tx id?
}

// TODO function fetchQuery and fetchQueries to stitch txs



export class ArweaveAccount {
	state = reactive({
		key: null as null | string,
		balance: null as null | string
	})
	queries = reactive({} as { [key: string]: GQLEdgeTransactionInterface[] })
	queriesStatus = reactive({} as { [key: string]: QueryStatusInterface })
	
	constructor (account: any) {
		if (typeof account === 'string') { this.state.key = account }
		else if (typeof account === 'object' && account?.key) { this.state.key = account?.key }
		else if (typeof account === 'object' && account?.jwk) {
			arweave.wallets.jwkToAddress(account.jwk).then((address) => this.state.key = address)
		}
	}
	
	get balance () { return this.state.balance }
	get key () { return this.state.key }
	
	async updateBalance () {
		if ((this.queriesStatus.balance ??= {}).fetch) { return }
		this.queriesStatus.balance.fetch = true
		await awaitEffect(() => this.key)
		try {
			const balance = await arweave.wallets.getBalance(this.key!)
			this.state.balance = arweave.ar.winstonToAr(balance)
			console.log('Wallet balance ', this.balance)
		} catch (e) { console.error(e) }
		finally { this.queriesStatus.balance.fetch = false }
	}
	fetchTransactions = (query: Query) => fetchTransactions(this, query)
	updateTransactions = (query: Query) => updateTransactions(this, query)
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
	await sleepUntilVisible()
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
		wallet.updateBalance()
		wallet.queries[query!].sort(sort)
	} else {
		// TODO only update balance when necessary
		for (const key in ArweaveStore.wallets) {
			ArweaveStore.wallets[key].updateBalance()
			for (const query in ArweaveStore.wallets[key].queries) {
				ArweaveStore.wallets[key].queries[query].sort(sort)
			}
		}
	}
}

function processUpdatedTxs () {
	// take tx array from update function that were not already known
	// check if wallets with cached balance are involved
}









export async function updateConversionRate () {
	if (ArweaveStore.conversion.isUpdating) { return }
	ArweaveStore.conversion.isUpdating = true
	await sleepUntilVisible()
	const currency = ArweaveStore.conversion.settings.currency
	const provider = ArweaveStore.conversion.settings.provider
	let result
	try {
		if (provider === 'redstone') {
			if (currency === 'USD') {
				result = await axios.get('https://api.redstone.finance/prices/?symbols=AR&provider=redstone')
				ArweaveStore.conversion.currentPrice = result.data['AR'].value
			} else {
				result = await axios.get('https://api.redstone.finance/prices/?symbols=AR,' + currency + '&provider=redstone')
				ArweaveStore.conversion.currentPrice = result.data['AR'].value / result.data[currency].value
			}
		}
	} catch (e) { console.error(e) }
	ArweaveStore.conversion.isUpdating = false
	return ArweaveStore.conversion.currentPrice
}

function loadCurrencySettings () {
	let currencySettings
	try { currencySettings = JSON.parse(localStorage.getItem('currency')!) } catch { }
	ArweaveStore.conversion.settings = currencySettings || { currency: 'USD', provider: 'redstone' }
}

function loadGatewaySettings () {
	updateArweave(localStorage.getItem('gateway') || gatewayDefault)
}



loadGatewaySettings()
loadCurrencySettings()
updateConversionRate()
setInterval(updateConversionRate, 600000)

window.addEventListener('storage', (e) => {
	if (e.newValue === e.oldValue) { return }
	else if (e.key === 'gateway') { loadGatewaySettings() }
	else if (e.key === 'currency') { loadCurrencySettings() }
})

watch(() => ArweaveStore.conversion.settings, (settings) => {
	localStorage.setItem('currency', JSON.stringify(settings))
	updateConversionRate()
}, { deep: true })



export function loadDemo () {
	console.log('loading test wallets')
	// pushWallet({ key: 'TId0Wix2KFl1gArtAT6Do1CbWU_0wneGvS5X9BfW5PE' })
	// pushWallet({ key: 'Bf3pWqxD1qwwF2fcE9bPNyQp_5TSlAYPJ3JNMgJSj4c' })
	// pushWallet({ key: 'vLRHFqCw1uHu75xqB4fCDW-QxpkpJxBtFD9g4QYUbfw' })
	// pushWallet({ key: 'zYqPZuALSPa_f5Agvf8g2JHv94cqMn9aBtnH7GFHbuA' })
}



if (import.meta.env.DEV) {
	window.ArweaveStore = ArweaveStore
	window.arweave = arweave
	window.arDB = arDB
}
