import { state, connectorChannels, filterChannels, initConnectorChannel, hasStorageAccess, awaitStorageAccess, initWebSocketChannel, useChannel } from '@/functions/Channels'
import JsonRpc from '@/functions/JsonRpc'
import { watch, watchEffect, computed, ref, Ref } from 'vue'
import { getWalletById } from '@/functions/Wallets'
import InterfaceStore from '@/store/InterfaceStore'

let windowRef: Window
const { origin, session } = state.value
export const sharedState = useChannel('sharedState:', '' + origin + session).state
export const connectors = computed(() => Object.values(connectorChannels.states)
	.filter(val => val.walletId !== false).sort((a, b) => a.timestamp! - b.timestamp!))



if (sessionStorage.getItem('type') === 'extension' || document.location.pathname.split('/').filter(el => el)[0] === 'extension') {
	sessionStorage.setItem('type', 'extension')
	state.value.type = 'extension'
	windowRef = window.parent
} else if (origin?.split('://')[0] === 'ws') {
	initWebSockets()
} else if (window.opener) {
	state.value.type = 'popup'
	windowRef = window.opener
	initConnector()
} else if (window.parent && window.parent !== window) {
	state.value.type = 'iframe'
	windowRef = window.parent
	initConnector()
}

if (!state.value.type) { state.value.type = 'client' }
if (state.value.type !== 'iframe') { localStorage.setItem('global', '1') }

// if sharedState.link was active for a connection and iframe is unloaded, disconnect
// only show connections when popup or iframe is active



async function initConnector () {
	if (!origin) { return }
	await awaitStorageAccess()
	const { state: connectorState, deleteChannel } = initConnectorChannel()
	const postMessage = (message: any) => windowRef.postMessage({ ...message, jsonrpc: '2.0' }, origin)
	const jsonRpc = new JsonRpc(postMessage, connectorState)
	window.addEventListener('message', async (e) => {
		if (e.source !== windowRef || e.origin !== origin) { return }
		const prompt = await jsonRpc.pushMessage(e.data)
		console.log(prompt, state.value.type, connectorState.value.link)
		if (prompt && state.value.type === 'iframe' && connectorState.value.link) { postMessage({ method: 'showIframe', params: true }) }
	})
	const connect = () => {
		// todo reject transactions that are designated to current address
		if (!connectorState.value.walletId) { return }
		const wallet = getWalletById(connectorState.value.walletId)
		if (!wallet) { return }
		postMessage({ method: 'connect', params: wallet.key })
	}
	const disconnect = () => { deleteChannel(); postMessage({ method: 'disconnect' }) }
	if (state.value.type === 'iframe') {
		InterfaceStore.toolbar.enabled = false
		window.addEventListener('beforeunload', () => disconnect())
	}
	if (state.value.type === 'popup') {
		if (!connectorState.value.walletId) { InterfaceStore.toolbar.enabled = false }
		const keepPopup = computed(() => !connectorState.value.link)
		watch(keepPopup, () => postMessage({ method: 'keepPopup', params: keepPopup.value }), { immediate: true })
	}
	watch(() => connectorState.value.walletId, (id) => id === false ? disconnect() : connect())
	watchEffect(() => {
		const linkedState = Object.entries(filterChannels({ origin, session, type: state.value.type === 'popup' ? 'iframe' : 'popup' }))[0]?.[1]
		if (linkedState) {
			connectorState.value.link = true
			postMessage({ method: 'usePopup', params: false })
		}
		const disconnectCondition = () => !linkedState && state.value.type === 'iframe' && connectorState.value.link && (connectorState.value.walletId == null || connectorState.value.walletId === false)
		if (disconnectCondition()) { setTimeout(() => disconnectCondition() && disconnect(), 500) }
	})
	postMessage({ method: 'ready' })
}



async function initWebSockets () {
	if (!origin) { return }
	const { state: connectorState, deleteChannel } = initWebSocketChannel()
	const ws = new WebSocket(origin)
	const postMessage = (message: any) => ws.send(JSON.stringify({ ...message, jsonrpc: '2.0' }))
	const jsonRpc = new JsonRpc(postMessage, connectorState)
	ws.addEventListener('open', () => console.log('New WS connection'))
	ws.addEventListener('message', event => {
		const message = JSON.parse(event.data.toString())
		console.log(event.data)
		jsonRpc.pushMessage(message)
	})
	const connect = () => {
		if (!connectorState.value.walletId) { return }
		const wallet = getWalletById(connectorState.value.walletId)
		if (!wallet) { return }
		postMessage({ method: 'connect', params: wallet.key })
	}
	const disconnect = () => { deleteChannel(); postMessage({ method: 'disconnect' }) }
	watch(() => connectorState.value.walletId, (id) => id === false ? disconnect() : connect())
}



export function connectRequest () {
	windowRef.postMessage('arweave-app-extension:connect', '*')
}

export function navigateBack () {
	if (!window.opener) { return }
	try {
		window.open('', 'parent')
		window.opener.focus()
	} catch (e) { console.log(e) }
}

export function navigateBackAvailable (origin: string, session: string) { // todo figure out if the feature can work properly more often
	return false
	return window.opener && state.value.origin === origin && state.value.session === session
}
