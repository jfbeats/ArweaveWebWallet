import Arweave from 'arweave'
import { state, states, filterChannels, initConnectorChannel, hasStorageAccess, awaitStorageAccess } from '@/functions/Channels'
import JsonRpc from '@/functions/JsonRpc'
import { awaitEffect } from '@/functions/Utils'
import { watch, watchEffect, computed } from 'vue'

let windowRef
const { origin, session } = state



if (window.opener) {
	localStorage.setItem('global', '1')
	state.type = 'popup'
	windowRef = window.opener
	initConnector()
} else if (window.parent && window.parent !== window) {
	state.type = 'iframe'
	windowRef = window.parent
	initConnector()
} else {
	localStorage.setItem('global', '1')
	state.type = 'client'
	// if sharedState.link was active for a connection and iframe is unloaded, disconnect
	// only show connections when popup or iframe is active
}


async function initConnector () {
	await awaitStorageAccess()
	const connectorChannel = initConnectorChannel()
	connectorChannel.initChannel()
	const sharedState = connectorChannel.state
	const connect = () => {
		// todo reject the whole queue
		postMessage({ method: 'connect', params: sharedState.wallet })
	}
	const disconnect = () => { connectorChannel.deleteChannel(); postMessage({ method: 'disconnect' }) }
	watchEffect(() => {
		if (sharedState.wallet === false) { disconnect() }
		else if (sharedState.wallet) { connect(sharedState.wallet) }
	})
	watchEffect(() => {
		const linkedState = Object.entries(filterChannels({ origin, session, type: state.type == 'popup' ? 'iframe' : 'popup' }))[0]?.[1]
		if (linkedState) { sharedState.link = true }
		else if (state.type == 'iframe' && sharedState.link && !sharedState.wallet) { disconnect() }
	})

	const procedures = {
		signTransaction: {
			guard: (params) => {
				return typeof params !== 'object' 
				|| params.format !== 2 
				|| params.owner && params.owner !== sharedState.wallet
				|| true
			}, // todo finish guard
			procedure: (params) => ''
		},
	}

	const jsonRpc = new JsonRpc(procedures)

	window.addEventListener('message', (e) => {
		if (e.source !== windowRef || e.origin !== origin) { return }
		console.info(`${location.hostname}:${state.type}:`, e.data)
		jsonRpc.pushMessage(e.data, postMessage)
	})
	if (state.type === 'iframe') { window.addEventListener('beforeunload', () => disconnect()) }

	postMessage({ method: 'ready' })
}



function postMessage (message) {
	windowRef.postMessage({ ...message, jsonrpc: '2.0' }, origin)
}

export function navigateBack () {
	if (!window.opener) { return }
	try {
		window.open('', 'parent')
		window.opener.focus()
	} catch (e) { console.log(e) }
}

export function navigateBackAvailable (origin, session) {
	return window.opener && state.origin === origin && state.session === session
}



export { state }