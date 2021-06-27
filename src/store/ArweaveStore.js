import Arweave from 'arweave'
import ArDB from 'ardb'
import axios from 'axios'
import { reactive } from 'vue'



const gatewayDefault = {
	host: 'arweave.net',
	port: 443,
	protocol: 'https'
}

const ArweaveStore = reactive({
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
	Object.assign(wallet, { queries: {}, queriesStatus: {} })
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
		for (const query in wallet.queries) {
			const tx = wallet.queries[query].find(el => el?.node?.id === txId)
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
	if (!wallet || wallet.queriesStatus[query]?.completed) { return }
	const queries = {
		received: () => arDB.search().to(wallet.key),
		sent: () => arDB.search().from(wallet.key),
	}
	let result
	if (wallet.queries[query] && wallet.queries[query].length > 0) {
		const lastTxIndex = wallet.queries[query].length - 1
		const cursor = wallet.queries[query][lastTxIndex].cursor
		result = await queries[query]().cursor(cursor).find()
	} else {
		wallet.queries[query] = []
		result = await queries[query]().find()
	}
	if (result.length < 10) {
		if (!wallet.queriesStatus[query]) { wallet.queriesStatus[query] = {} }
		wallet.queriesStatus[query].completed = true
	}
	wallet.queries[query].push(...result)
	return wallet.queries[query]
}

export async function updateConversionRate () {
	const res = await axios.get('https://api.limestone.finance/prices?symbol=AR&provider=limestone')
	ArweaveStore.currency.limestone = res.data[0].value
	console.log('Conversion Rate', ArweaveStore.currency.limestone)
	return ArweaveStore.currency.limestone
}



updateArweave()
updateConversionRate()
setInterval(updateConversionRate, 600000)

if (ArweaveStore.wallets.length > 0) { ArweaveStore.currentWallet = ArweaveStore.wallets[0] }
window.ArweaveStore = ArweaveStore