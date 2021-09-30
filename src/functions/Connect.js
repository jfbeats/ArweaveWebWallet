import { reactive, watchEffect } from 'vue'

const origin = new URLSearchParams(window.location.hash.slice(1)).get('origin')
const instance = origin + Math.random().toString().slice(2)
const requestChannel = 'connector:' + instance
const responseChannel = 'connectorResult:' + instance
const stateChannel = 'connectorState:' + instance
const messageQueue = []

const state = reactive({
	origin,
	wallet: null,
	processing: false,
})
watchEffect(() => localStorage.setItem(stateChannel, JSON.stringify(state)))
window.addEventListener('message', (e) => {
	if (e.key !== stateChannel || e.newValue === e.oldValue) { return }
	try { Object.assign(state, JSON.parse(e.newValue)) } catch (e) { }
})



export function connect (walletAddress) {
	postMessage({ method: 'connect', params: { address: walletAddress } })
	state.wallet = walletAddress
}

export function disconnect () {
	postMessage({ method: 'disconnect' })
	state.wallet = null
}

export function postMessage (message) {
	window.parent.postMessage({ jsonrpc: '2.0', ...message }, origin)
}

async function processMessage () {
	if (!messageQueue.length || state.processing) { return }
	state.processing = true
	const message = messageQueue[0]
	let action = null // check if message can be processed right away
	action ??= await broadcastMessage(message)
	const response = { id: message.data.id }
	if (action === 'accepted') {
		// process request
	}
	if (action === 'rejected') { response.error = 'rejected' }
	postMessage(response)
	messageQueue.splice(0, 1)
	localStorage.removeItem(responseChannel)
	localStorage.removeItem(requestChannel)
	state.processing = false
	processMessage()
}

async function broadcastMessage (message) {
	localStorage.setItem(requestChannel, JSON.stringify(message))
	await new Promise(resolve => setTimeout(() => resolve(), 500))
	if (!(await heartbeat('client'))) {
		const popup = window.open(window.location.href, '_blank', 'location,resizable,scrollbars,width=360,height=600')
		if (!popup) { } // popup blocked
	}
	return new Promise(resolve => {
		const userActionListener = (e) => {
			if (!e.newValue || e.key !== responseChannel) { return }
			if (e.newValue === 'accepted' || e.newValue === 'rejected') {
				window.removeEventListener('storage', userActionListener)
				resolve(e.newValue)
			}
		}
		window.addEventListener('storage', userActionListener)
	})
}

export async function heartbeat (instanceName) {
	localStorage.setItem('heartbeat:' + instanceName, '')
	return new Promise(resolve => {
		const heartbeatListener = async (e) => {
			if (e.key !== 'heartbeat:' + instanceName || !e.newValue) { return }
			heartbeatReturn(true)
		}
		const heartbeatReturn = (result) => {
			localStorage.removeItem('heartbeat:' + instanceName)
			window.removeEventListener('storage', heartbeatListener)
			resolve(result)
		}
		window.addEventListener('storage', heartbeatListener)
		setTimeout(() => heartbeatReturn(false), 1000)
	})
}



export function launchConnector () {
	state.type = 'connector'
	window.addEventListener('message', (e) => {
		if (e.source !== window.parent || e.origin !== origin) { return }
		if (![].includes(e.data.method)) { postMessage({ error: 'Unsupported method', id: e.data.id }) }
		const message = { instance, state: null, data: e.data }
		messageQueue.push(message)
		processMessage()
	})
	window.addEventListener('storage', (e) => {
		if (e.key === 'heartbeat:' + instanceName) { localStorage.setItem('heartbeat:' + instanceName, 'ok') }
	})
}



export function launchClient () {
	state.type = 'client'
	window.addEventListener('storage', (e) => {
		if (e.key === 'heartbeat:client') { localStorage.setItem('heartbeat:client', 'ok') }
	})
}