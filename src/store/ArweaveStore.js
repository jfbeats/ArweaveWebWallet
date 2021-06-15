import Arweave from 'arweave'
import ArDB from 'ardb'
import axios from 'axios'
import { reactive } from 'vue'

const arweave = Arweave.init({
	host: 'arweave.net',
	port: 443,
	protocol: 'https'
})
const arDB = new ArDB(arweave)

const ArweaveStore = reactive({
	arweave,

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

	async pushWallet (wallet) {
		Object.assign(wallet, { queries: {}, queriesStatus: {} })
		if (!wallet.key && wallet.jwk) { wallet.key = await arweave.wallets.jwkToAddress(wallet.jwk) }
		if (this.getWalletByKey(wallet.key)) { return this.getWalletByKey(wallet.key) }
		if (!wallet.id) { wallet.id = this.getNewId() }
		this.wallets.push(wallet)
		return wallet
	},

	getNewId () {
		for (let i = 0; i <= this.wallets.length; i++) {
			if (this.wallets.map(e => e.id).indexOf(i) === -1) { return i }
		}
	},

	getWalletById (walletId) {
		return this.wallets.find(wallet => wallet.id == walletId)
	},

	getWalletByKey (walletKey) {
		return this.wallets.find(wallet => wallet.key == walletKey)
	},

	setCurrentWallet (wallet) {
		this.currentWallet = wallet
		this.updateWalletBalance(wallet)
		console.log('Current wallet set to ', wallet)
	},

	async updateWalletBalance (wallet) {
		const balance = await arweave.wallets.getBalance(wallet.key)
		wallet.balance = arweave.ar.winstonToAr(balance)
		console.log('Wallet balance ', wallet.balance)
		return wallet.balance
	},

	async fetchTransactions (wallet, query) {
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
	},

	async updateConversionRate () {
		const res = await axios.get('https://api.limestone.finance/prices?symbol=AR&provider=limestone')
		this.currency.limestone = res.data[0].value
		console.log('Conversion Rate', this.currency.limestone)
		return this.currency.limestone
	},
})

if (ArweaveStore.wallets.length > 0) { ArweaveStore.currentWallet = ArweaveStore.wallets[0] }
ArweaveStore.updateConversionRate()
setInterval(() => { ArweaveStore.updateConversionRate() }, 600000)

export default ArweaveStore