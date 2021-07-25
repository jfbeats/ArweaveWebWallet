import Arweave from 'arweave'
import ArDB from 'ardb'
import axios from 'axios'
import { getVerification } from 'arverify'
import { reactive, watch } from 'vue'
import InterfaceStore from '@/store/InterfaceStore'



const ArweaveStore = reactive({
	gatewayURL: null,
	currentWallet: null,
	wallets: [],
	txs: {},
	arverify: {},
	redstone: {
		currentPrice: null,
		currency: 'USD',
	},
	uploads: {},
})

let arweave
let arDB

export function updateArweave (gateway) {
	const urlToSettings = (url) => {
		const obj = new URL(url)
		const protocol = obj.protocol.replace(':', '')
		const host = obj.hostname
		const port = obj.port ? parseInt(obj.port) : protocol === 'https' ? 443 : 80
		return { protocol, host, port }
	}
	const settingsToUrl = (settings) => `${settings.protocol}://${settings.host}:${settings.port}/`
	const settings = typeof gateway === 'string' ? urlToSettings(gateway) : gateway
	arweave = settings ? Arweave.init(settings) : Arweave.init()
	arDB = new ArDB(arweave)
	const api = arweave.getConfig().api
	ArweaveStore.gatewayURL = settingsToUrl(api)
}

export async function pushWallet (wallet) {
	Object.assign(wallet, { balance: null, queries: {}, queriesStatus: {} })
	if (!wallet.key && wallet.jwk) { wallet.key = await arweave.wallets.jwkToAddress(wallet.jwk) }
	const existingWallet = getWalletByKey(wallet.key)
	if (existingWallet) {
		Object.assign(existingWallet, wallet)
		return existingWallet
	}
	if (!wallet.id) { wallet.id = getNewId() }
	ArweaveStore.wallets.push(wallet)
	return wallet
}

export function getNewId () {
	for (let i = 0; i <= ArweaveStore.wallets.length; i++) {
		if (ArweaveStore.wallets.map(e => e.id).indexOf(i) === -1) { return i }
	}
}

export function getWalletById (walletId) {
	return ArweaveStore.wallets.find(wallet => wallet.id == walletId)
}

export function getWalletByKey (walletKey) {
	return ArweaveStore.wallets.find(wallet => wallet.key == walletKey)
}

export async function getTxById (txId) {
	for (const wallet of ArweaveStore.wallets) {
		for (const queryKey in wallet.queries) {
			const tx = wallet.queries[queryKey].find(el => el?.node?.id === txId)
			if (tx) { return tx.node }
		}
	}
	return (await arDB.search().id(txId).find())[0]?.node
}

export function setCurrentWallet (wallet) {
	ArweaveStore.currentWallet = wallet
	updateWalletBalance(wallet)
	console.log('Current wallet set to ', wallet)
}

export async function updateWalletBalance (wallet) {
	const balance = await arweave.wallets.getBalance(wallet.key)
	wallet.balance = arweave.ar.winstonToAr(balance)
	console.log('Wallet balance ', wallet.balance)
	return wallet.balance
}

export async function fetchTransactions (wallet, query) {
	if (!wallet || wallet.queriesStatus[query]?.completed) { return }
	if (wallet.queriesStatus[query]?.fetchTransactions) {
		return new Promise(resolve => {
			watch(() => wallet.queriesStatus[query].fetchTransactions, (value) => { if (!value) { resolve() } })
		})
	}
	wallet.queriesStatus[query] ??= {}
	wallet.queriesStatus[query].fetchTransactions = true
	if (query === 'all') {
		await fetchTransactionsAll(wallet)
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
	if (!wallet.queries[query] || wallet.queries[query].length === 0) { return fetchTransactions(wallet, query) }
	if (!wallet || !InterfaceStore.windowVisible || wallet.queriesStatus[query]?.fetchTransactions) { return }
	if (wallet.queriesStatus[query]?.updateTransactions) {
		return new Promise(resolve => {
			watch(() => wallet.queriesStatus[query].updateTransactions, (value) => { if (!value) { resolve() } })
		})
	}
	wallet.queriesStatus[query].updateTransactions = true
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
	const set = new Set(wallet.queries.all)
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
		wallet.queries[query].sort(sort)
	} else {
		for (const wallet of ArweaveStore.wallets) {
			for (const query in wallet.queries) {
				wallet.queries[query].sort(sort)
			}
		}
	}
}

export async function getArverify (address) {
	if (!address.match(/^[a-z0-9_-]{43}$/i)) { return }
	return ArweaveStore.arverify[address] ??= getVerification(address)
}

export async function updateConversionRate () {
	if (!InterfaceStore.windowVisible) { return }
	const currency = ArweaveStore.redstone.currency
	let result
	if (currency === 'USD') {
		result = await axios.get('https://api.redstone.finance/prices/?symbols=AR&provider=redstone')
		ArweaveStore.redstone.currentPrice = result.data['AR'].value
	} else {
		result = await axios.get('https://api.redstone.finance/prices/?symbols=AR,' + currency + '&provider=redstone')
		ArweaveStore.redstone.currentPrice = result.data['AR'].value / result.data[currency].value
	}
	return ArweaveStore.redstone.currentPrice
}



const gatewayDefault = {
	host: 'arweave.net',
	port: 443,
	protocol: 'https'
}

updateArweave(localStorage.getItem('gateway') || gatewayDefault)

ArweaveStore.redstone.currency = localStorage.getItem('currency') || 'USD'
watch(() => ArweaveStore.redstone.currency, (value) => {
	localStorage.setItem('currency', value)
	updateConversionRate()
})
watch(() => InterfaceStore.windowVisible, (visible) => {
	if (visible && !ArweaveStore.redstone.currentPrice) { updateConversionRate() }
})
updateConversionRate()
setInterval(updateConversionRate, 600000)



// Testing

if (process.env.NODE_ENV === 'development') {
	window.ArweaveStore = ArweaveStore
	window.arweave = arweave
}



export default ArweaveStore
export { arweave, arDB }