import TransportWebUSB from "@ledgerhq/hw-transport-webusb"
import ArweaveApp from "@zondax/ledger-arweave"
import { arweave, ArweaveAccount, ArweaveMessageRunner, ArweaveProvider } from '@/store/ArweaveStore'
import { ArweaveVerifier as ArweaveMessageVerifier } from 'arweave-wallet-connector/lib/ArweaveWebWallet'
import LogoLedger from '@/assets/logos/ledger.svg?component'
import Transaction from 'arweave/web/lib/transaction'
import { SignatureOptions } from 'arweave/web/lib/crypto/crypto-interface'
import type { WalletProxy } from '@/functions/Wallets'



async function getTransport () {
	console.info(`Trying to connect via WebUSB...`)
	return TransportWebUSB.create()
}

async function getVersion () {
	const transport = await getTransport()
	let response = null
	try {
		const app = new ArweaveApp(transport)
		console.info("Requesting version")
		response = await app.getVersion()
		if (response.returnCode !== ArweaveApp.ErrorCode.NoError) {
			console.error(`Error [${response.returnCode}] ${response.errorMessage}`)
		} else {
			console.info(`App Version ${response.major}.${response.minor}.${response.patch}`, response)
		}
	} finally { await transport.close() }
	return response
}

async function getAppInfo () {
	const transport = await getTransport()
	let response = null
	try {
		const app = new ArweaveApp(transport)
		console.info("Requesting app info")
		// @ts-ignore
		response = await app.appInfo()
		if (response.returnCode !== ArweaveApp.ErrorCode.NoError) {
			console.error(`Error [${response.returnCode}] ${response.errorMessage}`)
		} else {
			console.info("Response received!", response)
		}
	} finally { await transport.close() }
	return response
}

async function getInfo (request = false) {
	const transport = await getTransport()
	let response = null
	try {
		const app = new ArweaveApp(transport)
		console.info("Requesting address")
		response = request ? await app.showAddress() : await app.getAddress()
		if (response.returnCode !== ArweaveApp.ErrorCode.NoError) {
			console.error(`Error [${response.returnCode}] ${response.errorMessage}`)
		} else {
			console.info("Response received!", response)
		}
	} finally { await transport.close() }
	return response
}

const getAddress = async (request = false) => (await getInfo(request)).address
const getPublicKey = async () => (await getInfo()).owner

async function sign (tx: Transaction) {
	const transport = await getTransport()
	try {
		const app = new ArweaveApp(transport)
		const addr = await app.getAddress()
		tx.owner = addr.owner
		const response = await app.sign(tx)
		const id = await arweave.crypto.hash(response.signature)
		const sigjs = {
			owner: addr.owner,
			signature: await arweave.utils.bufferTob64Url(response.signature),
			id: await arweave.utils.bufferTob64Url(id)
		}
		await tx.setSignature(sigjs)
		console.info("Transaction signed", tx)
	} finally { await transport.close() }
	return tx
}



export class LedgerProvider extends ArweaveAccount implements Provider {
	static get metadata (): StaticMetadata { return {
		name: 'Ledger',
		icon: LogoLedger,
		link: 'https://shop.ledger.com?r=1a60a479b0af',
		// @ts-ignore
		isSupported: !!window.navigator.usb,
		isProviderFor: (walletProxy) => walletProxy.data.provider === 'ledger',
		addImportData: async (walletData) => {
			walletData.provider = 'ledger'
			walletData.arweave = { key: await getAddress() }
		},
		verify: async () => getAddress(true),
	}}
	get metadata (): Metadata<ArweaveProvider> { return {
		...LedgerProvider.metadata,
		methods: {
			signTransaction: { userIntent: true },
			getPublicKey: { userIntent: true },
			sign: { unavailable: true, userIntent: true },
			decrypt: { unavailable: true, userIntent: true },
		},
	}}
	#wallet: WalletProxy
	messageVerifier: ArweaveMessageVerifier
	messageRunner: ArweaveMessageRunner
	constructor (init: WalletProxy) {
		super(init)
		this.#wallet = init
		this.messageVerifier = new ArweaveMessageVerifier()
		this.messageRunner = new ArweaveMessageRunner(this as any)
	}
	get id () { return this.#wallet.id }
	get uuid () { return this.#wallet.uuid }
	async signTransaction (tx: Transaction, options: SignatureOptions) {
		if (this.key !== await getAddress()) { throw new Error('Wrong account') } // todo getting wrong account error while ledger does not have the app opened
		if (tx.owner && tx.owner !== await this.getPublicKey()) { throw 'error' }
		return sign(tx)
	}
	async getPublicKey () { return getPublicKey() }
}