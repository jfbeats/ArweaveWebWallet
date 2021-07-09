import Arweave from 'arweave'
import ArDB from 'ardb'
import axios from 'axios'
import { getVerification } from "arverify"
import { reactive, watch } from 'vue'
import InterfaceStore from '@/store/InterfaceStore'



const gatewayDefault = {
	host: 'arweave.net',
	port: 443,
	protocol: 'https'
}

const ArweaveStore = reactive({
	gatewayDefault,
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



export default ArweaveStore
export let arweave
export let arDB

export function updateArweave (gatewaySettings = gatewayDefault) {
	ArweaveStore.gatewayURL = `${gatewaySettings.protocol}://${gatewaySettings.host}:${gatewaySettings.port}/`
	arweave = new Arweave(gatewaySettings)
	arDB = new ArDB(arweave)
}

export async function pushWallet (wallet) {
	Object.assign(wallet, { balance: null, queries: {}, queriesStatus: {} })
	if (!wallet.key && wallet.jwk) { wallet.key = await arweave.wallets.jwkToAddress(wallet.jwk) }
	if (getWalletByKey(wallet.key)) { return getWalletByKey(wallet.key) }
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
	return arDB.search('transaction').id(txId).find()
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
		|| wallet.queriesStatus[query]?.fetchTransactions
		|| wallet.queriesStatus[query]?.updateTransactions) { return }
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
	} finally { wallet.queriesStatus[query].fetchTransactions = false }
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
	} finally { wallet.queriesStatus[query].updateTransactions = false }
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
	// TODO if is valid address
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

watch(() => ArweaveStore.redstone.currency, updateConversionRate)


updateArweave()
updateConversionRate()
setInterval(updateConversionRate, 600000)

if (ArweaveStore.wallets.length > 0) { ArweaveStore.currentWallet = ArweaveStore.wallets[0] }



// Testing

if (process.env.NODE_ENV === 'development') {
	window.ArweaveStore = ArweaveStore
	pushWallet({ key: 'TId0Wix2KFl1gArtAT6Do1CbWU_0wneGvS5X9BfW5PE' })
	pushWallet({ key: 'Bf3pWqxD1qwwF2fcE9bPNyQp_5TSlAYPJ3JNMgJSj4c' })
	pushWallet({ key: 'vLRHFqCw1uHu75xqB4fCDW-QxpkpJxBtFD9g4QYUbfw' })
	pushWallet({ key: 'zYqPZuALSPa_f5Agvf8g2JHv94cqMn9aBtnH7GFHbuA' })
}