import Arweave from 'arweave'
import { state, states, connectorChannels, filterChannels, initConnectorChannel, hasStorageAccess, awaitStorageAccess } from '@/functions/Channels'
import JsonRpc, { getProcedures } from '@/functions/JsonRpc'
import { awaitEffect } from '@/functions/Utils'
import { watch, watchEffect, computed, reactive, ref } from 'vue'

let windowRef
const { origin, session } = state
const sharedState = ref(null)
export const connectors = computed(() => {
	const allConnectors = Object.entries(connectorChannels.states)
		.filter(([key, val]) => key !== (origin + session) && val.wallet !== false)
		.map(([key, val]) => val)
	if (sharedState.value) { allConnectors.push(sharedState.value) }
	return allConnectors.sort((a, b) => a.timestamp - b.timestamp)
})



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

export { state }



async function initConnector () {
	await awaitStorageAccess()
	const { state: connectorState, initChannel, deleteChannel } = initConnectorChannel()
	sharedState.value = connectorState
	initChannel()
	const connect = () => {
		// todo reject transactions that are designated to current address
		postMessage({ method: 'connect', params: connectorState.wallet })
	}
	const disconnect = () => { deleteChannel(); postMessage({ method: 'disconnect' }) }
	watch(() => connectorState.wallet, (wallet) => wallet === false ? disconnect() : connect(wallet))
	watchEffect(() => {
		const linkedState = Object.entries(filterChannels({ origin, session, type: state.type === 'popup' ? 'iframe' : 'popup' }))[0]?.[1]
		if (linkedState) { connectorState.link = true }
		const disconnectCondition = () => !linkedState && state.type === 'iframe' && connectorState.link && !connectorState.wallet
		if (disconnectCondition()) { setTimeout(() => disconnectCondition() && disconnect(), 500) }
	})
	const extendedGuards = {
		signTransaction: (params) => params.tx.owner && params.tx.owner !== connectorState.wallet
	}
	const procedures = getProcedures(extendedGuards)
	const jsonRpc = new JsonRpc(procedures, postMessage, connectorState)
	window.addEventListener('message', (e) => {
		if (e.source !== windowRef || e.origin !== origin) { return }
		console.info(`${location.hostname}:${state.type}:`, e.data)
		jsonRpc.pushMessage(e.data)
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
