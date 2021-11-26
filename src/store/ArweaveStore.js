import Arweave from 'arweave/web'
import ArDB from 'ardb'
import { awaitEffect } from '@/functions/Utils'
import axios from 'axios'
import { computed, reactive, ref, watch } from 'vue'
import InterfaceStore, { sleepUntilVisible } from '@/store/InterfaceStore'



const ArweaveStore = reactive({
	gatewayURL: null,
	wallets: {},
	txs: {},
	conversion: {
		currentPrice: null,
		isUpdating: false,
		settings: { currency: 'USD', provider: 'redstone' },
	},
	uploads: {},
})

export default ArweaveStore
export let arweave
export let arDB



const gatewayDefault = {
	host: 'arweave.net',
	port: 443,
	protocol: 'https'
}

export function urlToSettings (url) {
	if (!url.includes('://')) { url = 'https://' + url }
	const obj = new URL(url)
	const protocol = obj.protocol.replace(':', '')
	const host = obj.hostname
	const port = obj.port ? parseInt(obj.port) : protocol === 'https' ? 443 : 80
	return { protocol, host, port }
}

export function settingsToUrl (settings) {
	return `${settings.protocol}://${settings.host}:${settings.port}/`
}

export async function testGateway (gateway) {
	const settings = typeof gateway === 'string' ? urlToSettings(gateway) : gateway
	const arweaveTest = Arweave.init(settings)
	try {
		const net = await arweaveTest.network.getInfo()
		if (net) { return true }
	} catch (e) { }
	return false
}

export function updateArweave (gateway) {
	const settings = typeof gateway === 'string' ? urlToSettings(gateway) : gateway
	arweave = settings ? Arweave.init(settings) : Arweave.init(gatewayDefault)
	arDB = { search: (...args) => new ArDB(arweave).search(...args) }
	ArweaveStore.gatewayURL = settingsToUrl(arweave.getConfig().api)
}

export async function getTxById (txId) {
	if (ArweaveStore.txs[txId]?.block) { return }
	await sleepUntilVisible()
	const result = (await arDB.search().id(txId).find())[0]
	if (!result) { return }
	Object.assign(ArweaveStore.txs[result.node.id] ??= {}, result.node)
}



const wallets = {}

export class ArweaveWallet {
	protocol = 'arweave'
	balance = ref(null)
	queries = reactive({})
	queriesStatus = reactive({})
	isUserWallet = computed(() => true)
	constructor (wallet) { this.key = wallet.key }
	updateBalance = () => updateBalance(this)
	fetchTransactions = (query) => fetchTransactions(this, query)
	updateTransactions = (query) => updateTransactions(this, query)
	// add a send tx function that only takes a data object as tx param
}



export async function updateBalance (wallet) {
	// wallet = initWallet(wallet)
	const balance = await arweave.wallets.getBalance(wallet.key)
	wallet.balance.value = arweave.ar.winstonToAr(balance)
	console.log('Wallet balance ', wallet.balance)
	return wallet.balance
}

export async function fetchTransactions (wallet, query) {
	// wallet = initWallet(wallet)
	if (wallet.queriesStatus[query]?.completed) { return }
	await awaitEffect(() => !wallet.queriesStatus[query]?.fetchTransactions)
	wallet.queriesStatus[query] ??= {}
	wallet.queriesStatus[query].fetchTransactions = true
	if (query === 'all') {
		try { await fetchTransactionsAll(wallet) }
		catch (e) { console.error(e) }
		wallet.queriesStatus[query].fetchTransactions = false
		return
	}
	let fulfilled = false
	let results
	const queries = {
		received: () => arDB.search().to(wallet.key),
		sent: () => arDB.search().from(wallet.key),
	}
	try {
		for (let i = 0; !fulfilled; i++) {
			if (!wallet.queries[query]) {
				results = await queries[query]().find()
			} else {
				const lastTxIndex = wallet.queries[query].length - 1
				const cursor = wallet.queries[query][lastTxIndex].cursor
				results = await queries[query]().cursor(cursor).find()
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
	finally { wallet.queriesStatus[query].fetchTransactions = false }
}

async function fetchTransactionsAll (wallet) {
	wallet.queries.all ??= []
	const stopCondition = () => {
		return (wallet.queriesStatus.received?.completed || wallet.queriesStatus.all.received?.node.block)
			&& (wallet.queriesStatus.sent?.completed || wallet.queriesStatus.all.sent?.node.block)
	}
	for (let i = 0; i < 10 || !stopCondition(); i++) {
		const nextTx = {}
		const fetchPromises = []
		for (const query of ['received', 'sent']) {
			const fetch = async () => {
				if (!wallet.queries[query]) { await fetchTransactions(wallet, query) }
				const index = wallet.queries[query].indexOf(wallet.queriesStatus.all[query])
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
	await new Promise(resolve => setTimeout(() => resolve(), 10))
}

export async function updateTransactions (wallet, query) {
	// wallet = initWallet(wallet)
	if (!wallet.queries[query] || wallet.queries[query].length === 0) { return fetchTransactions(wallet, query) }
	if (wallet.queriesStatus[query]?.fetchTransactions) { return }
	await awaitEffect(() => !wallet.queriesStatus[query]?.updateTransactions)
	wallet.queriesStatus[query].updateTransactions = true
	await sleepUntilVisible()
	if (query === 'all') {
		await updateTransactionsAll(wallet)
		wallet.queriesStatus[query].updateTransactions = false
		return
	}
	let requireSort = false
	let fulfilled = false
	let results
	const queries = {
		received: () => arDB.search().to(wallet.key),
		sent: () => arDB.search().from(wallet.key),
	}
	const resultsFiltered = []
	try {
		for (let i = 0; !fulfilled; i++) {
			if (i === 0) {
				results = await queries[query]().find() // Todo - Use the number of pending txs as minimum
			} else {
				const lastTxIndex = results.length - 1
				const cursor = results[lastTxIndex].cursor
				results = await queries[query]().cursor(cursor).find()
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
	finally { wallet.queriesStatus[query].updateTransactions = false }
}

async function updateTransactionsAll (wallet) {
	const fetchPromises = []
	const newTxs = []
	for (const query of ['received', 'sent']) {
		const fetch = async () => {
			await updateTransactions(wallet, query)
			for (const [index, tx] of wallet.queries[query].entries()) {
				if (
					index < wallet.queries[query].indexOf(wallet.queriesStatus.all[query])
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
	const results = await arDB.search().ids(ids).findAll()
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

function sortByBlocks (wallet, query) {
	const sort = (a, b) => (b.node.block?.height ?? Number.MAX_SAFE_INTEGER)
		- (a.node.block?.height ?? Number.MAX_SAFE_INTEGER)
	if (wallet && wallet.queries[query]) {
		wallet.updateBalance(wallet)
		wallet.queries[query].sort(sort)
	} else {
		// for (const wallet of ArweaveStore.wallets) {
		// 	wallet.updateBalance(wallet)
		// 	for (const query in wallet.queries) {
		// 		wallet.queries[query].sort(sort)
		// 	}
		// }
	}
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
	try { currencySettings = JSON.parse(localStorage.getItem('currency')) } catch { }
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
