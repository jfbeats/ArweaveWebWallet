import Arweave from 'arweave'
import ArDB from 'ardb'
import axios from 'axios'
import { reactive } from 'vue'
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
	wallets: [
		{
			id: 0,
			key: 'TId0Wix2KFl1gArtAT6Do1CbWU_0wneGvS5X9BfW5PE',
			balance: null,
			queries: {},
			queriesStatus: {},
		},
		{
			id: 1,
			key: 'Bf3pWqxD1qwwF2fcE9bPNyQp_5TSlAYPJ3JNMgJSj4c',
			balance: null,
			queries: {},
			queriesStatus: {},
		},
		{
			id: 2,
			key: 'vLRHFqCw1uHu75xqB4fCDW-QxpkpJxBtFD9g4QYUbfw',
			balance: null,
			queries: {},
			queriesStatus: {},
		},
	],
	txs: {},
	currency: {
		limestone: null,
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
	if (!wallet) { return }
	const queries = {
		received: () => arDB.search().to(wallet.key),
		sent: () => arDB.search().from(wallet.key),
	}
	let results
	if (wallet.queries[query] && wallet.queries[query].length > 0) {
		const lastTxIndex = wallet.queries[query].length - 1
		const cursor = wallet.queries[query][lastTxIndex].cursor
		results = await queries[query]().cursor(cursor).find()
	} else {
		wallet.queries[query] = []
		results = await queries[query]().find()
	}
	if (results.length < 10) {
		(wallet.queriesStatus[query] ??= {}).completed = true
	}
	for (const result of results) {
		result.node = Object.assign(ArweaveStore.txs[result.node.id] ??= {}, result.node)
	}
	wallet.queries[query].push(...results)
	if (results[results.length - 1] && !results[results.length - 1].node.block) {
		await fetchTransactions(wallet, query)
	}
	return wallet.queries[query]
}

export async function updateTransactions (wallet, query) {
	if (!wallet || !InterfaceStore.windowVisible) { return }
	let requireSort = false
	const queries = {
		received: () => arDB.search().to(wallet.key),
		sent: () => arDB.search().from(wallet.key),
	}
	if (!wallet.queries[query] || wallet.queries[query].length === 0) { return fetchTransactions(wallet, query) }
	// Grab batches of 10 until we reach known data
	let fulfilled = false
	let results
	const resultsFiltered = []
	for (let i = 0; !fulfilled; i++) {
		if (i === 0) {
			results = await queries[query]().find()
		} else {
			const lastTxIndex = resultsFiltered.length - 1
			const cursor = resultsFiltered[lastTxIndex].cursor
			results = await queries[query]().cursor(cursor).find()
		}
		for (const result of results) {
			result.node = Object.assign(ArweaveStore.txs[result.node.id] ??= {}, result.node)
			const matchingTx = wallet.queries[query].find(el => el.node.id === result.node.id)
			if (matchingTx) {
				fulfilled = true
				matchingTx.cursor = result.cursor
			} else {
				resultsFiltered.push(result)
				if (result.node.block) { requireSort = true }
			}
		}
	}
	if (resultsFiltered.length > 0) { wallet.queries[query].splice(0, 0, ...resultsFiltered) }
	// Refresh additional pendings txs
	const ids = []
	for (const tx of wallet.queries[query]) {
		if (!tx.node.block && !results.find(el => el.node.id === tx.node.id)) {
			ids.push(tx.node.id)
		}
	}
	if (ids.length !== 0) {
		results = await arDB.search().ids(ids).findAll()
		console.log('updating:', results)
		for (const id of ids) {
			const result = results.find(el => el.node.id === id)
			if (result) {
				if (result.node.block) { requireSort = true }
				Object.assign(ArweaveStore.txs[result.node.id] ??= {}, result.node)
			} else {
				console.error('tx missing? :0', tx)
			}
		}
	}
	if (requireSort) { sortByBlocks() }
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

export async function updateConversionRate () {
	if (!InterfaceStore.windowVisible) { return }
	const res = await axios.get('https://api.redstone.finance/prices?symbol=AR&provider=redstone')
	ArweaveStore.currency.limestone = res.data[0].value
	console.log('Conversion Rate', ArweaveStore.currency.limestone)
	return ArweaveStore.currency.limestone
}



updateArweave()
updateConversionRate()
setInterval(updateConversionRate, 600000)

if (ArweaveStore.wallets.length > 0) { ArweaveStore.currentWallet = ArweaveStore.wallets[0] }



// Testing
window.ArweaveStore = ArweaveStore

pushWallet({ id: 4, key: 'zYqPZuALSPa_f5Agvf8g2JHv94cqMn9aBtnH7GFHbuA' })