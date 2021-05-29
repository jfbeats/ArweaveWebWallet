import { reactive } from 'vue'
import { loadWallets } from './StateFunctions'
import Arweave from 'arweave'
import ArDB from 'ardb'
import axios from 'axios'

const arweave = Arweave.init()
const arDB = new ArDB(arweave)

export const ArweaveStore = reactive({
	arweave,

	currentWallet: null,

	wallets: [
		{
			id: 0,
			key: 'TId0Wix2KFl1gArtAT6Do1CbWU_0wneGvS5X9BfW5PE',
			balance: null,
			received: [],
			sent: [],
		},
		{
			id: 1,
			key: 'Bf3pWqxD1qwwF2fcE9bPNyQp_5TSlAYPJ3JNMgJSj4c',
			balance: null,
			received: [],
			sent: [],
		},
	],

	currency: {
		limestone: null,
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
		this.updateConversionRate()
		console.log('Current wallet set to ', wallet)
	},

	async updateWalletBalance (wallet) {
		const balance = await arweave.wallets.getBalance(wallet.key)
		wallet.balance = arweave.ar.winstonToAr(balance)
		console.log('Wallet balance ', wallet.balance)
		return wallet.balance
	},

	async updateReceived (wallet) {
		const received = await arDB.search().to(wallet.key).find()
		wallet.received = received
		console.log('Received transactions', wallet.received)
		return wallet.received
	},

	async updateSent (wallet) {
		const sent = await arDB.search().from(wallet.key).find()
		wallet.sent = sent
		console.log('Sent transactions ', wallet.sent)
		return wallet.sent
	},

	async updateConversionRate () {
		if (this.currency.limestone) {return}
		this.currency.limestone = 0
		const res = await axios.get('https://api.limestone.finance/prices?symbol=AR&provider=limestone')
		this.currency.limestone = res.data[0].value
		console.log('Conversion Rate', this.currency.limestone)
		return this.currency.limestone
	},
})



if (ArweaveStore.wallets.length > 0) { ArweaveStore.currentWallet = ArweaveStore.wallets[0] }