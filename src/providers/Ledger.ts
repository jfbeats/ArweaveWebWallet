import { WalletProxy } from '@/providers/WalletProxy'
import { mix } from '@/functions/UtilsClass'
import TransportWebUSB from "@ledgerhq/hw-transport-webusb"
import TransportWebHID from "@ledgerhq/hw-transport-webhid"
// import TransportWebBLE from "@ledgerhq/hw-transport-web-ble"
import ArweaveApp from "@zondax/ledger-arweave"
import { ArweaveAccount, ArweaveMessageRunner } from '@/providers/Arweave'
import { arweave } from '@/store/ArweaveStore'
import { ArweaveVerifier as ArweaveMessageVerifier } from 'arweave-wallet-connector/lib/Arweave.js'
import LogoLedger from '@/assets/logos/ledger.svg?component'
import IconVerify from '@/assets/icons/verify.svg?component'
import IconLaunch from '@/assets/icons/launch.svg?component'
import type Transaction from 'arweave/web/lib/transaction'
import type { SignatureOptions } from 'arweave/web/lib/crypto/crypto-interface'
import { track } from '@/store/Analytics'



const transports = [TransportWebHID, TransportWebUSB]
let selectedTransport: any

async function getTransport () {
	if (selectedTransport) { return selectedTransport.create() }
	console.info(`Trying to connect`)
	for (const transport of transports) {
		if (await transport.isSupported()) {
			try {
				const currentTransport = await transport.create()
				selectedTransport = transport
				return currentTransport
			} catch (e) { console.error(e) }
		}
	}
	throw 'getTransport failed'
}

function handleResponse (response: any) {
	if (response.returnCode !== ArweaveApp.ErrorCode.NoError) {
		throw `Error [${response.returnCode}] ${response.errorMessage}`
	} else {
		console.info(`App Version ${response.major}.${response.minor}.${response.patch}`, response)
	}
}

async function getVersion () {
	const transport = await getTransport()
	let response = null
	try {
		const app = new ArweaveApp(transport)
		console.info("Requesting version")
		response = await app.getVersion()
		handleResponse(response)
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
		handleResponse(response)
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
		handleResponse(response)
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
		handleResponse(response)
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



export class LedgerProvider extends mix(ArweaveAccount).with(WalletProxy) implements Provider {
	constructor (init: WalletDataInterface) {
		super(init)
		this.messageVerifier = new ArweaveMessageVerifier()
		this.messageRunner = new ArweaveMessageRunner(this as any)
	}
	static get metadata (): ProviderMetadata { return {
		id: 'ledger',
		name: 'Ledger',
		icon: LogoLedger,
		disabled: !window.navigator.usb, // todo change to async computed and test all transports
		addImportData: async (walletData) => {
			walletData ??= {}
			walletData.provider = LedgerProvider.metadata.id
			walletData.data ??= {}
			walletData.data.arweave = { key: await getAddress() }
			return walletData
		},
		actions: [
			{ name: 'Verify address', icon: IconVerify, run: async () => getAddress(true) },
			{ name: 'Purchase | affiliate link', icon: IconLaunch, to: 'https://shop.ledger.com?r=1a60a479b0af', run: () => track.event('affiliate', 'https://shop.ledger.com?r=1a60a479b0af') },
		],
	}}
	get metadata (): InstanceMetadata<LedgerProvider> { return {
		...LedgerProvider.metadata,
		methods: {
			signTransaction: { userIntent: true },
			getPublicKey: { userIntent: true },
		},
	}}
	messageVerifier: ArweaveMessageVerifier
	messageRunner: ArweaveMessageRunner
	async signTransaction (tx: Transaction, options?: SignatureOptions) {
		if (this.key !== await getAddress()) { throw new Error('Wrong account: using ' + this.key + ' but current device is ' + await getAddress()) }
		if (tx.owner && tx.owner !== await this.getPublicKey()) { throw 'error' }
		return sign(tx)
	}
	async getPublicKey () { return getPublicKey() }
}