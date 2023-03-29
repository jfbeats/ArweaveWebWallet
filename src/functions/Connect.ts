import { appInfo, awaitStorageAccess, connectorChannels, state, states, useChannel } from '@/functions/Channels'
import JsonRpc, { getOwnerIdFromMessage } from '@/functions/JsonRpc'
import { computed, effectScope, reactive, Ref, ref, shallowRef, watch, watchEffect } from 'vue'
import { getWalletById, Wallets } from '@/functions/Wallets'
import { useDataWrapper } from '@/functions/AsyncData'
import InterfaceStore, { onUnload } from '@/store/InterfaceStore'
import { track } from '@/store/Telemetry'
import { Emitter } from '@/functions/UtilsClass'
import { ArweaveApi } from 'arweave-wallet-connector'
import type { Connection } from 'arweave-wallet-connector/lib/types'

let windowRef: Window
const { origin, session } = state.value
export const { state: sharedState, deleteChannel } = useChannel('sharedState:', '' + origin + session)
const connectorsData = computed(() => connectorChannels.states.value
	.filter(val => val.walletId !== false).sort((a, b) => a.timestamp - b.timestamp))

function buildConnector (origin: string): ConnectorState {
	const scope = effectScope(true)
	return scope.run(() => {
		const sharedStates = computed(() => connectorsData.value.filter(c => c.origin === origin))
		const instanceStates = computed(() => states.value.filter(c => c.origin === origin))
		const walletId = computed({
			get: () => {
				const disconnected = sharedStates.value.find(c => c.walletId === false)
				if (disconnected) { sharedStates.value.forEach(c => c.walletId = false); return false }
				const id = sharedStates.value.find(c => c.walletId)?.walletId
				if (!id) { return }
				sharedStates.value.forEach(c => c.walletId !== id && (c.walletId = id))
				return id
			},
			set: id => sharedStates.value.forEach(c => c.walletId !== id && (c.walletId = id))
		})
		const messageQueue = computed(() => sharedStates.value
			.map(c => c.messageQueue).flat().sort((a, b) => a.timestamp - b.timestamp))
		const appInfo = computed(() => sharedStates.value.find(c => c.appInfo)?.appInfo)
		const connectionSettings = useChannel('connectionSettings:', origin, {}).state
		watch(connectionSettings, () => {
			if (walletId.value != null) { return }
			const autoConnectWalletUuid = Object.entries(connectionSettings.value ?? {}).find(entry => entry[1].connect)?.[0]
			const id = getWalletById(autoConnectWalletUuid)?.id
			if (id != null) { walletId.value = id }
		}, { immediate: true })
		const destructor = () => scope.stop()
		return reactive({ origin, sharedStates, instanceStates, walletId, messageQueue, appInfo, connectionSettings, destructor })
	})!
}

const origins = computed(() => {
	const result = [] as string[]
	connectorsData.value.forEach(c => !result.includes(c.origin) && result.push(c.origin))
	return result
})

export const connectors = useDataWrapper(origins, x => x, buildConnector, c => c.destructor())
export const connector = computed(() => connectors.value.find(c => c.origin === origin))



if (sessionStorage.getItem('type') === 'extension' || document.location.pathname.split('/').filter(el => el)[0] === 'extension') {
	sessionStorage.setItem('type', 'extension')
	state.value.type = 'extension'
	windowRef = window.parent
} else if (origin?.split('://')[0] === 'ws') {
	state.value.type = 'ws'
	initWebSockets()
} else if (origin && window.opener) {
	state.value.type = 'popup'
	windowRef = window.opener
	initConnector()
} else if (origin && window.parent && window.parent !== window) {
	state.value.type = 'iframe'
	windowRef = window.parent
	initConnector()
}

if (!state.value.type) { state.value.type = 'client' }
if (state.value.type !== 'iframe') { localStorage.setItem('global', '1') }


// todo use getOwnerIdFromMessage() on push to not request connection page
const localJsonRpc = (function LocalJsonRpc () {
	const emitter = new Emitter<{ [id: number]: any }>()
	let id = 0
	const constructor = (name: string) => {
		const channel = useChannel('sharedState:', 'local' + Math.random())
		if (!initSharedState(channel.state, { walletId: undefined, origin: 'local', session: Math.random() + '', appInfo: { name } })) { throw 'Unable to init state' }
		const jsonRpc = new JsonRpc(message => emitter.emit(message.id, message), channel.state)
		onUnload(channel.deleteChannel)
		channel.state.value.walletId = Wallets.value[0]?.id
		watch(() => jsonRpc.state.value.messageQueue, async val => {
			const id = await getOwnerIdFromMessage(instance?.jsonRpc.state.value.messageQueue.find(el => !el.fulfilled))
			id != undefined && instance!.channel.state.value && (instance!.channel.state.value.walletId = id)
		}, { immediate: true, deep: true })
		watch(() => channel.state.value?.walletId, id => id === false && channel.state.value?.messageQueue
			.forEach(m => !m.fulfilled && (m.status = 'rejected')))
		return { channel, jsonRpc }
	}
	let instance: ReturnType<typeof constructor>
	const pending = ref(0)
	watch(pending, val => {
		if (!instance || !instance.channel.state.value) { return }
		if (val > 0) { instance.channel.state.value.walletId === false && (instance.channel.state.value.walletId = undefined) }
		else { instance.channel.state.value.walletId = false }
	}, { immediate: true })
	const connect = (name?: string) => {
		instance ??= constructor(name ?? 'Imported')
		if (instance.channel.state.value?.walletId === false) { instance.channel.state.value!.walletId = undefined }
		return instance
	}
	const push = (e: Message) => {
		connect()
		const currentId = id++
		e.id = currentId
		return new Promise((res, rej) => {
			emitter.once(currentId, message => message.error ? rej(message.error) : res(message.result) ).finally(() => pending.value--)
			instance!.jsonRpc.pushMessage(e)
			pending.value++
		})
	}
	return { connect, push }
})()


class LocalRPC implements Connection {
	constructor () {}
	connect (name?: string) { return localJsonRpc.connect(name) }
	disconnect () { this.connect().channel.state.value!.walletId = false }
	postMessage (...args: Parameters<Connection['postMessage']>) {
		const [method, params, options] = args
		if (['connect', 'disconnect'].includes(method)) { return }
		return localJsonRpc.push({ method, params })
	}
}
const ArweaveClass = ArweaveApi(LocalRPC)

export const RPC = {
	arweave: new ArweaveClass()
}



function initSharedState (state: Ref, init?: Partial<SharedState>): state is Ref<SharedState> {
	if (!init?.origin && (!origin || origin === '*')) { return false }
	if (!state.value?.origin) { state.value = Object.assign({ origin, session, appInfo, timestamp: Date.now(), messageQueue: [], links: {} }, init ?? {}) }
	return true
}



async function initConnector () {
	await awaitStorageAccess()
	if (!initSharedState(sharedState)) { return }
	sharedState.value.links[state.value.type!] = true
	const jsonRpc = new JsonRpc(postMessage, sharedState)
	window.addEventListener('message', async (e) => {
		if (e.source !== windowRef || e.origin !== origin) { return }
		if (e.data?.method === 'ready') { return postMessage({ id: e.data?.id, method: 'ready' }) }
		if (e.data?.method === 'connect') { return }
		if (e.data?.method === 'disconnect') { sharedState.value.walletId = false; return postMessage({ id: e.data?.id }) }
		if (e.data?.method === 'showIframe') { return }
		const prompt = await jsonRpc.pushMessage(e.data)
		if (prompt) { focusWindow() }
	})
	const connect = () => {
		if (sharedState.value.walletId === false || sharedState.value.walletId == undefined) { return }
		const wallet = getWalletById(sharedState.value.walletId)
		if (!wallet) { return }
		postMessage({ method: 'connect', params: wallet.key })
	}
	const disconnect = () => {
		if (connector.value) { connector.value.walletId = false }
		deleteChannel()
		postMessage({ method: 'usePopup', params: true })
		postMessage({ method: 'disconnect' })
	}
	if (state.value.type === 'iframe') {
		InterfaceStore.toolbar.enabled = false
		onUnload(() => { !state.value.updating && connector.value && (connector.value.sharedStates.length > 1 ? deleteChannel() : disconnect()) })
	}
	if (state.value.type === 'popup') {
		if (sharedState.value.walletId == undefined) { InterfaceStore.toolbar.enabled = false }
		const keepPopup = computed(() => !sharedState.value.link)
		watch(keepPopup, () => postMessage({ method: 'keepPopup', params: keepPopup.value }), { immediate: true })
		onUnload(() => {
			if (state.value.updating) { return }
			!sharedState.value.links?.iframe && connector.value && (connector.value.sharedStates.length > 1 ? deleteChannel() : disconnect())
			window.close()
		})
	}
	watch(() => sharedState.value.walletId, id => {
		if (id === false) { return disconnect() }
		if (id == undefined) { return }
		connect()
		if (!sharedState.value.connected) { track.event('Connect', sharedState.value.origin) }
		sharedState.value.connected = true
	})
	watchEffect(() => {
		const linkedState = sharedState.value.links.popup && sharedState.value.links.iframe
		if (linkedState) {
			sharedState.value.link = true
			postMessage({ method: 'usePopup', params: false })
		}
		if (state.value.type === 'iframe') {
			const disconnectCondition = !state.value.updating && !linkedState && sharedState.value.link && (sharedState.value.walletId == null || sharedState.value.walletId === false)
			if (disconnectCondition) { setTimeout(() => disconnectCondition && disconnect(), 500) }
		}
	})
	postMessage({ method: 'ready' })
}



async function initWebSockets () {
	if (!initSharedState(sharedState)) { return }
	sharedState.value.links[state.value.type!] = true
	const ws = new WebSocket(origin!)
	const postMessage = (message: any) => ws.send(JSON.stringify({ ...message, jsonrpc: '2.0' }))
	const jsonRpc = new JsonRpc(postMessage, sharedState)
	ws.addEventListener('open', () => console.log('New WS connection'))
	ws.addEventListener('message', event => {
		const message = JSON.parse(event.data.toString())
		console.log(message)
		jsonRpc.pushMessage(message)
	})
	const connect = () => {
		if (sharedState.value.walletId === false || sharedState.value.walletId == undefined) { return }
		const wallet = getWalletById(sharedState.value.walletId)
		if (!wallet) { return }
		postMessage({ method: 'connect', params: wallet.key })
	}
	const disconnect = () => { deleteChannel(); postMessage({ method: 'disconnect' }) }
	watch(() => sharedState.value.walletId, (id) => id === false ? disconnect() : connect())
	onUnload(disconnect)
}



async function postMessage (message: any) {
	return windowRef.postMessage({ ...message, jsonrpc: '2.0' }, origin!)
}

export async function focusWindow () {
	window.focus()
	if (state.value.type === 'iframe' && sharedState.value?.link) { return postMessage({ method: 'showIframe', params: true }) }
}

export async function postMessageExtension (message: 'connect' | 'permissions' | 'state' | 'close') {
	if (state.value.type !== 'extension') { return }
	if (message === 'connect') { return postMessageExtensionConnect() }
	windowRef.postMessage('arweave-app-extension:' + message, '*')
	if (message === 'state') { return postMessageExtensionState() }
}

async function postMessageExtensionConnect () {
	const state = await postMessageExtension('state')
	if (!state) { return }
	return new Promise<void>((res, rej) => {
		windowRef.postMessage('arweave-app-extension:' + 'connect', '*')
		const snapshot = connectorsData.value.filter(connector => connector.origin === state.origin)
		const stop = watch(() => connectorsData.value, () => {
			const diff = connectorsData.value.filter(connector => connector.origin === state.origin && !snapshot.includes(connector))
			if (diff.find(connector => connector.links.popup)) { postMessageExtension('close') }
		}, { deep: true, immediate: true })
		setTimeout(() => {
			stop()
			res()
			// rej() if script wasn't already injected and no new connection appeared
		}, 10000)
	})
}

async function postMessageExtensionState () {
	return new Promise<{ origin: string }>(res => {
		const listener = (e: any) => {
			if (e.source !== windowRef || typeof e.data !== 'object' || typeof e.data.origin !== 'string') { return }
			res(e.data)
			window.removeEventListener('message', listener)
		}
		window.addEventListener('message', listener)
	})
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
