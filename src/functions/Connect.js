import Arweave from 'arweave'
import { state, states, filterChannels, initConnectorChannel, hasStorageAccess, awaitStorageAccess } from '@/functions/Channels'
import JsonRpc, { getProcedures } from '@/functions/JsonRpc'
import { awaitEffect } from '@/functions/Utils'
import { watch, watchEffect, computed, reactive } from 'vue'

let windowRef
const { origin, session } = state
const connectorState = reactive({})

watch(() => connectorState, () => console.log(connectorState), { immediate: true, deep: true })



const ConnectorFeed = reactive([])
export default ConnectorFeed

// feedItem { component, message }
// items only includes unfulfilled messages

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
	const connectorChannel = initConnectorChannel(connectorState)
	connectorChannel.initChannel()
	const connect = () => {
		// todo reject the whole queue
		postMessage({ method: 'connect', params: connectorState.wallet })
	}
	const disconnect = () => { connectorChannel.deleteChannel(); postMessage({ method: 'disconnect' }) }
	watchEffect(() => {
		if (connectorState.wallet === false) { disconnect() }
		else if (connectorState.wallet) { connect(connectorState.wallet) }
	})
	watchEffect(() => {
		const linkedState = Object.entries(filterChannels({ origin, session, type: state.type == 'popup' ? 'iframe' : 'popup' }))[0]?.[1]
		if (linkedState) { connectorState.link = true }
		else if (state.type == 'iframe' && connectorState.link && !connectorState.wallet) { disconnect() }
	})
	const procedures = getProcedures(extendedGuards)
	connectorState.messageQueue = []
	const jsonRpc = new JsonRpc(procedures, connectorState.messageQueue)
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



const extendedGuards = {
	signTransaction: (params) => params.tx.owner && params.tx.owner !== connectorState.wallet
}