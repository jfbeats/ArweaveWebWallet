import TransportWebUSB from "@ledgerhq/hw-transport-webusb"
import ArweaveApp from "@zondax/ledger-arweave"
import ArweaveStore from '@/store/ArweaveStore'


async function getTransport () {
	console.log(`Trying to connect via WebUSB...`)
	return TransportWebUSB.create()
}

async function getVersion () {
	const transport = await getTransport()
	try {
		const app = new ArweaveApp(transport)
		console.info("Requesting version")
		const response = await app.getVersion()
		if (response.returnCode !== ArweaveApp.ErrorCode.NoError) {
			console.error(`Error [${response.returnCode}] ${response.errorMessage}`)
			return
		}
		console.info(`App Version ${response.major}.${response.minor}.${response.patch}`, response)
		return response
	} finally { transport.close() }
}

async function appInfo () {
	const transport = await getTransport()
	try {
		const app = new ArweaveApp(transport)
		console.info("Requesting app info")
		const response = await app.appInfo()
		if (response.returnCode !== ArweaveApp.ErrorCode.NoError) {
			console.error(`Error [${response.returnCode}] ${response.errorMessage}`)
			return
		}
		console.info("Response received!", response)
		return response
	} finally { transport.close() }
}

async function getActiveAddress (request = false) {
	const transport = await getTransport()
	try {
		const app = new ArweaveApp(transport)
		let response = await app.getVersion()
		console.info(`App Version ${response.major}.${response.minor}.${response.patch}`, response)
		console.info("Requesting address")
		response = request ? await app.showAddress() : await app.getAddress()
		if (response.returnCode !== ArweaveApp.ErrorCode.NoError) {
			console.error(`Error [${response.returnCode}] ${response.errorMessage}`)
			return
		}
		console.info("Response received!", response)
		return response
	} finally { transport.close() }
}

async function sign (transaction) {
	const transport = await getTransport()
	try {
		const arweave = ArweaveStore.arweave
		const app = new ArweaveApp(transport)
		let response = await app.getVersion()
		console.info(`App Version ${response.major}.${response.minor}.${response.patch}`, response)
		let addr = await app.getAddress()
		transaction.owner = addr.owner
		response = await app.sign(transaction)
		let id = await arweave.crypto.hash(response.signature)
		let sigjs = {
			signature: await arweave.utils.bufferTob64Url(response.signature),
			id: await arweave.utils.bufferTob64Url(id)
		}
		await transaction.setSignature(sigjs)
		console.info("Transaction signed")
		return transaction
	} finally { transport.close() }
}

const Ledger = { getVersion, appInfo, getActiveAddress, sign }

export default Ledger