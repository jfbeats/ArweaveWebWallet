import TransportWebUSB from "@ledgerhq/hw-transport-webusb"
import ArweaveApp from "@zondax/ledger-arweave"
import { arweave, ArweaveAccount, ArweaveAPI, ArweaveProvider } from '@/store/ArweaveStore'
import LogoLedger from '@/assets/logos/ledger.svg?component'
import Transaction from 'arweave/web/lib/transaction'
import { ArweaveVerifier } from 'arweave-wallet-connector/lib/ArweaveWebWallet'
import { SignatureOptions } from 'arweave/web/lib/crypto/crypto-interface'
import { state } from '@/functions/Connect'


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





export const metadata: Metadata = {
	isSupported: !!window.navigator.usb,
	name: 'Ledger',
	icon: LogoLedger,
}

export const LedgerProviderData: ProviderData = {
	...metadata,
	getImportData: async () => ({
		provider: 'ledger',
		arweave: { key: await getAddress() },
	}),
}

export class LedgerProvider extends ArweaveAccount implements Provider {
	static isProviderFor (wallet: WalletDataInterface) { return wallet.provider === 'ledger' }
	constructor (wallet: WalletDataInterface) { super(wallet) }
	get metadata () { return metadata }
	async signTransaction (tx: Transaction, options: SignatureOptions) {
		if (this.key !== await getAddress()) { throw new Error('Wrong account') }
		if (tx.owner && tx.owner !== await this.getPublicKey()) { throw 'error' }
		return sign(tx)
	}
	async getPublicKey () { return getPublicKey() }
	verifyMessage (message: Message | string) {
		const verifier = new ArweaveVerifier()
		// @ts-ignore
		if (typeof message === 'string') { return !!verifier[message] }
		// @ts-ignore
		return verifier[message.method]?.(...(message.params || [])) || false
	}
	async runMessage (message: Message) {
		if (state.type === 'iframe') { return }
		if (!this.verifyMessage(message)) { throw 'params changed and are not valid anymore' }
		const runner = new ArweaveAPI(this as any)
		// @ts-ignore
		return runner[message.method]?.(...(message.params || []))
	}
}