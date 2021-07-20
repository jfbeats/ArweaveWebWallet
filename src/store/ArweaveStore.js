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
	if (!wallet || wallet.queriesStatus[query]?.completed
		|| wallet.queriesStatus[query]?.fetchTransactions) { return }
	wallet.queriesStatus[query] ??= {}
	wallet.queriesStatus[query].fetchTransactions = true
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
	return wallet.queries[query]
}

export async function updateTransactions (wallet, query) {
	if (!wallet.queries[query] || wallet.queries[query].length === 0) { return fetchTransactions(wallet, query) }
	if (!wallet || !InterfaceStore.windowVisible
		|| wallet.queriesStatus[query]?.fetchTransactions
		|| wallet.queriesStatus[query]?.updateTransactions) { return }
	wallet.queriesStatus[query].updateTransactions = true
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
	return wallet.queries[query]
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
	const sort = (a, b) => (b.node.block?.height || Number.MAX_SAFE_INTEGER)
		- (a.node.block?.height || Number.MAX_SAFE_INTEGER)
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