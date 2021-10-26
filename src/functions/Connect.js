import Arweave from 'arweave'
import { state, filterChannels, hasStorageAccess, awaitStorageAccess } from '@/functions/Channels'
import { awaitEffect } from '@/functions/Utils'
import { watch, watchEffect } from 'vue'

let windowRef
const messageQueue = []
const { origin, session } = state

if (window.opener) {
	state.type = 'popup'
	windowRef = window.opener
	watch(() => state.wallet, (wallet) => wallet ? connect(wallet) : disconnect())
	watchEffect(() => {
		const linkedInstance = Object.entries(filterChannels({ origin, session, type: 'iframe' }))[0]?.[1]
		if (linkedInstance) { state.link = true }
		else { state.link = false }
	})
	window.addEventListener('message', messageListener)
	postMessage({ method: 'ready' })
} else if (window.parent && window.parent !== window) {
	state.type = 'iframe'
	windowRef = window.parent
	watch(() => state.wallet, (wallet) => wallet ? connect(wallet) : disconnect())
	watchEffect(() => {
		const linkedInstance = Object.entries(filterChannels({ origin, session, type: 'popup' }))[0]?.[1]
		if (linkedInstance) { state.link = true }
		else {
			if (state.link && !state.wallet) { disconnect() }
			state.link = false
		}
	})
	window.addEventListener('message', messageListener)
	postMessage({ method: 'ready' })
} else {
	state.type = 'client'
	localStorage.setItem('global', '1')
}



export function connect (walletAddress) {
	// todo reject the whole queue
	postMessage({ method: 'connect', params: walletAddress })
}

export function disconnect () {
	postMessage({ method: 'disconnect' })
}

export function postMessage (message) {
	windowRef.postMessage({ ...message }, origin)
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
	const { method, id } = e.data
	if (e.source !== windowRef || e.origin !== origin) { return }
	console.info(`${location.hostname}:${state.type}:`, e.data)
	if (typeof method !== 'string') { return }
	if (typeof id !== 'number') { return }
	if (!Object.keys(procedures).includes(method)) {
		return postMessage({ error: 'Unsupported method', id })
	}
	messageQueue.push(e.data)
	// await storage
	// skip completed messages
	processMessage()
}

async function processMessage () {
	if (!messageQueue.length || state.processing) { return }
	state.processing = true
	const { method, params, id } = messageQueue[0]
	const response = { id }
	try {
		let action = 'rejected' // todo check if message can be processed right away
		if (action === 'accepted') {
			response.result = await procedures[method](params)
		} else {
			response.error = 'rejected'
		}
	} catch (e) {
		response.error = e.message
	}
	postMessage(response)
	messageQueue.splice(0, 1)
	state.processing = false
	// update current id, watch linked component id somewhere
	processMessage()
}

const procedures = {
	async signTransaction (params) {
		if (typeof message.params !== 'string')
			if (params.format !== 2) { throw 'unsupported format' }
		if (params.owner && params.owner !== state.wallet) { throw 'Wrong owner' }
		console.log('tx would be signed here', params)
		return '😁'
	},
}



function setTask (task, from) {
	if (!state.link) { return }
	if (task === 'default') {

	}
}



export { state }