import Arweave from 'arweave'
import { origin, state, clients, instanceStartPromise } from '@/functions/Channels'
import { watch } from 'vue'

const messageQueue = []



export function connect (walletAddress) {
	// todo reject the whole queue
	postMessage({ method: 'connect', params: { address: walletAddress } })
}

export function disconnect () {
	postMessage({ method: 'disconnect' })
}

export function postMessage (message) {
	window.parent.postMessage({ jsonrpc: '2.0', ...message }, origin)
}

export function navigateBack () {
	if (!navigateBackAvailable()) { return }
	try {
		window.open('', 'parent')
		window.opener.focus()
	} catch (e) { console.log(e) }
}

export function navigateBackAvailable (origin) {
	if (origin && state.origin !== origin) { return false }
	if (!window.opener) { return false }
	return true
}



async function processMessage () {
	if (!messageQueue.length || state.processing) { return }
	state.processing = true
	const message = messageQueue[0]
	const response = { id: message.id }
	try {
		await verifyMessage(message)
		let action = null // todo check if message can be processed right away
		action ??= await broadcastMessage(message)
		if (action === 'accepted') {
			response.result = await runMessage(message)
		} else {
			response.error = 'rejected'
		}
	} catch (e) {
		console.error(e)
		response.error = e
	}
	postMessage(response)
	messageQueue.splice(0, 1)
	delete state.response
	delete state.request
	state.processing = false
	processMessage()
}

async function verifyMessage (message) {
	return await procedures[message.method].verify(JSON.parse(message.params))
}

async function broadcastMessage (message) {
	if (!Object.keys(clients.value).length) {
		const popup = window.open(window.location.href, '_blank', 'location,resizable,scrollbars,width=360,height=600')
		if (!popup) { } // popup blocked
	}
	const watcher = new Promise(resolve => {
		const watchStop = watch(() => state.response, res => {
			if (res) { resolve(res); watchStop() }
		})
	})
	state.request = await procedures[message.method].broadcast(JSON.parse(message.params))
	return watcher
}

async function runMessage (message) {
	return await procedures[message.method].run(JSON.parse(message.params))
}

const procedures = {
	signTransaction: {
		verify (params) {
			if (params.format !== 2) { throw 'unsupported format' }
			if (params.owner && params.owner !== state.wallet) { throw 'Wrong owner' }
		},
		broadcast (params) {
			const fields = ['target', 'quantity', 'tags', 'data_size', 'reward']
			return Object.fromEntries(Object.entries(params).filter(entry => fields.includes(entry[0])))
		},
		async run (params) {
			console.log('tx would be signed here', params)
			return '😁'
		},
	},
}



export function launchConnector () {
	state.type = 'connector'
	watch(() => state.wallet, (wallet) => wallet ? connect(wallet) : disconnect())
	window.addEventListener('message', (e) => {
		if (e.source !== window.parent || e.origin !== origin) { return }
		const message = e.data
		console.info(`MessageChannel:${new URL(origin).hostname}->${location.hostname}`, message)
		if (
			typeof message.method !== 'string'
			|| !Object.keys(procedures).includes(message.method)
			|| 'params' in message && typeof message.params !== 'string'
		) {
			postMessage({ error: 'Unsupported method', id: message.id })
			return
		}
		messageQueue.push(message)
		processMessage()
	})
	instanceStartPromise({ origin }, 5000).then(() => {
		watch(() => clients.value, () => {
			if (!state.wallet && !Object.keys(clients.value).length) {
				disconnect()
			}
		}, { immediate: true })
	})
}



export function launchClient () {
	state.type = 'client'
}