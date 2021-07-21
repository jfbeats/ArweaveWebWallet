import TransportWebUSB from "@ledgerhq/hw-transport-webusb"
import ArweaveApp from "@zondax/ledger-arweave"
import { arweave } from '@/store/ArweaveStore'


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

async function getAddress (request = false) {
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

async function sign (transaction) {
	const transport = await getTransport()
	try {
		const app = new ArweaveApp(transport)
		const addr = await app.getAddress()
		transaction.owner = addr.owner
		const response = await app.sign(transaction)
		const id = await arweave.crypto.hash(response.signature)
		const sigjs = {
			owner: addr.owner,
			signature: await arweave.utils.bufferTob64Url(response.signature),
			id: await arweave.utils.bufferTob64Url(id)
		}
		await transaction.setSignature(sigjs)
		console.info("Transaction signed", transaction)
	} finally { await transport.close() }
	return transaction
}

const Ledger = {
	metaData: { provider: 'Ledger' },
	getVersion,
	getAppInfo,
	getActiveAddress: async () => (await getAddress()).address,
	getActivePublicKey: async () => (await getAddress()).owner,
	sign,
}

export default Ledger



// Testing

if (process.env.NODE_ENV === 'development') {
	window.arweaveWallet = Ledger
	window.testTx = async () => {
		const tx = await arweave.createTransaction({ data: '😁', })
		const signedTx = await arweave.transactions.sign(tx)
		console.log(await arweave.transactions.post(signedTx))
	}
}