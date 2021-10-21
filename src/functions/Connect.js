import Arweave from 'arweave'
import { state, instanceStartPromise } from '@/functions/Channels'
import { watch } from 'vue'

const messageQueue = []
const { origin, session } = state



export function connect (walletAddress) {
	// todo reject the whole queue
	postMessage({ method: 'connect', params: walletAddress })
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



async function messageListener (e) {
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
	if (
		state.type === 'connector' 
	) {}
	messageQueue.push(message)
	processMessage()
}

async function processMessage () {
	if (!messageQueue.length || state.processing) { return }
	state.processing = true
	const message = messageQueue[0]
	const response = { id: message.id }
	try {
		await verifyMessage(message)
		let action = null // todo check if message can be processed right away
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

async function runMessage (message) {
	return await procedures[message.method].run(JSON.parse(message.params))
}

const procedures = {
	signTransaction: {
		verify (params) {
			if (params.format !== 2) { throw 'unsupported format' }
			if (params.owner && params.owner !== state.wallet) { throw 'Wrong owner' }
		},
		async run (params) {
			console.log('tx would be signed here', params)
			return '😁'
		},
	},
}



function launch () {
	if (window.opener) {
		state.type = 'popup'
		localStorage.setItem('global', '1')
		watch(() => state.wallet, (wallet) => wallet ? connect(wallet) : disconnect())
	} else if (window.parent && window.parent !== window) {
		state.type = 'connector'
		watch(() => state.wallet, (wallet) => wallet ? connect(wallet) : disconnect())
		window.addEventListener('message', messageListener)
		instanceStartPromise({ origin, session }).then(() => {
			
		})
	} else {
		state.type = 'client'
		localStorage.setItem('global', '1')
	}
}



launch()
export { state }