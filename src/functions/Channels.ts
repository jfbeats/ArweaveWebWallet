import { getCurrentScope, onScopeDispose, reactive, watch, ref, effectScope } from 'vue'
import type { EffectScope, Ref, WatchStopHandle } from 'vue'
import { useDataWrapper } from '@/functions/AsyncData'

type PrefixTable = {
	'connectorState:': InstanceState
	'sharedState:': ConnectorState
	'connectionSettings:': ConnectionSettings
	wallets: WalletDataInterface[]
	currency: { rate?: string, currency: string, provider: string, timestamp?: number }
	gateway: string
	bundler: string
}



export class ChannelRef <T extends keyof PrefixTable> {
	state
	private readonly stateChannel
	private stopWrite?: WatchStopHandle
	
	constructor (prefix: T, instanceName = '', init?: PrefixTable[T]) {
		this.state = ref(init) as Ref<PrefixTable[T]>
		this.stateChannel = prefix + instanceName
		window.addEventListener('storage', this.storageListener)
		if (!localStorage.getItem(this.stateChannel)) {
			if (typeof this.state.value === 'object' && Object.keys(this.state).length) { this.writeState() }
			else if (this.state.value != null) { this.writeState() }
		}
		this.update(localStorage.getItem(this.stateChannel))
		if (getCurrentScope()) { onScopeDispose(() => this.stop()) }
	}
	stop = () => {
		window.removeEventListener('storage', this.storageListener)
		if (this.stopWrite) { this.stopWrite() }
	}
	
	private writeState = () => {
		const stateString = JSON.stringify(this.state.value)
		if (stateString === localStorage.getItem(this.stateChannel)) { return }
		localStorage.setItem(this.stateChannel, stateString)
	}
	private startWrite = () => this.stopWrite = watch(this.state, this.writeState, { deep: true })
	private update = (val: string | null) => {
		if (this.stopWrite) { this.stopWrite() }
		if (val) { this.state.value = JSON.parse(val) }
		this.startWrite()
	}
	private storageListener = (e: StorageEvent) => {
		if (e.key !== this.stateChannel || e.newValue === e.oldValue || !e.newValue) { return }
		this.update(e.newValue)
	}
	deleteChannel = () => {
		this.stop()
		localStorage.removeItem(this.stateChannel)
	}
}



const channelInstances = {} as { [key: string]: { channel: ChannelRef<any>, subscribers: number, scope: EffectScope } }
export function useChannel <T extends keyof PrefixTable> (prefix: T, instanceName = '', init?: PrefixTable[T]) {
	const key = prefix + instanceName
	
	if (!channelInstances[key]) {
		const scope = effectScope(true)
		const channel = scope.run(() => new ChannelRef(prefix, instanceName, init))!
		channelInstances[key] = { channel, subscribers: 0, scope }
	}
	channelInstances[key].subscribers++
	
	const stop = () => {
		channelInstances[key].subscribers--
		if (channelInstances[key].subscribers > 0) { return }
		channelInstances[key].scope.stop()
		delete channelInstances[key]
	}
	const deleteChannel = () => {
		channelInstances[key]?.channel?.deleteChannel()
	}
	if (getCurrentScope()) { onScopeDispose(stop) }
	return { state: channelInstances[key].channel.state, stop, deleteChannel } as ChannelRef<T>
}



const hash = new URLSearchParams(window.location.hash.slice(1))
const origin = hash.get('origin') || undefined
const session = hash.get('session') || undefined
const appInfo = { name: hash.get('name') || undefined, logo: hash.get('logo') || undefined }
const instance = origin + Math.random().toString().slice(2)
const { state, deleteChannel } = useChannel('connectorState:', instance, { origin, session })
const { states } = getChannels('connectorState:')
const connectorChannels = getChannels('sharedState:')

export function initConnectorChannel () {
	if (!origin) { throw 'Missing origin' }
	const channel = useChannel('sharedState:', origin + session)
	if (!channel.state.value?.origin) { channel.state.value = { origin, session, appInfo, timestamp: Date.now(), messageQueue: [] } }
	return channel
}

export function initWebSocketChannel () {
	if (!origin) { throw 'Missing origin' }
	const channel = useChannel('sharedState:', origin + session)
	if (!channel.state.value?.walletId) { channel.state.value = { origin, session, appInfo, timestamp: Date.now(), messageQueue: [] } }
	return channel
}

export { state, states, connectorChannels }



function getChannels <T extends 'connectorState:' | 'sharedState:'> (prefix: T) {
	const channels: { [key: string]: ChannelRef<T> | undefined } = {}
	const states: { [key: string]: PrefixTable[T] } = reactive({})
	const getInstanceNames = () => Object.keys(localStorage)
		.filter(key => key.slice(0, prefix.length) === prefix)
		.map(key => key.slice(prefix.length))
	const instantiate = async (name: string) => {
		channels[name] = undefined
		if (prefix === 'connectorState:' && !(await heartbeat(name))) { close(name); return null }
		if (!Object.keys(channels).includes(name)) { return null }
		channels[name] = useChannel(prefix, name)
		states[name] = channels[name]!.state as any
	}
	const close = (name: string) => {
		channels[name]?.stop()
		delete channels[name]
		delete states[name]
	}
	const storageListener = () => {
		const runningChannels = Object.keys(channels)
		const storageChannels = getInstanceNames()
		for (const channel of [...runningChannels, ...storageChannels]) {
			if (runningChannels.includes(channel) && storageChannels.includes(channel)) { continue }
			else if (storageChannels.includes(channel) && channel !== instance) { instantiate(channel) }
			else if (runningChannels.includes(channel)) { close(channel) }
		}
	}
	const closeChannels = () => {
		window.removeEventListener('storage', storageListener)
		for (const channel in channels) { close(channel) }
	}
	window.addEventListener('storage', storageListener)
	storageListener()
	return { states, closeChannels }
}



async function heartbeat (instanceName: string, timeout?: number) {
	if (instanceName === instance) { return true }
	const fullKey = 'heartbeat:' + instanceName + instance
	const promise = new Promise(resolve => {
		const heartbeatListener = async (e: StorageEvent) => {
			if (e.key === fullKey && e.newValue) { heartbeatReturn(true) }
		}
		const heartbeatReturn = (result: boolean) => {
			if (result) { clearTimeout(cleanupTimeout) }
			setTimeout(() => localStorage.removeItem(fullKey), 1000)
			if (!result) { console.log('removed') ; localStorage.removeItem('connectorState:' + instanceName) }
			window.removeEventListener('storage', heartbeatListener)
			resolve(result)
		}
		window.addEventListener('storage', heartbeatListener)
		const cleanupTimeout = setTimeout(() => heartbeatReturn(false), Math.max(5000, timeout || 0))
		if (timeout) { setTimeout(() => resolve(false), timeout) }
	})
	localStorage.setItem(fullKey, '')
	return promise
}

function cleanHeartbeats () {
	for (const key in localStorage) {
		if (key.slice(0, 'heartbeat:'.length) !== 'heartbeat:') { continue }
		const relatedChannel = 'connectorState:' + key.slice('heartbeat:'.length)
		if (localStorage.getItem(relatedChannel)) { continue }
		localStorage.removeItem(key)
	}
}

export function filterChannels (filter: object, object = states) {
	const filterFunction = ([key, state]: [string, any]) => typeof filter === 'function' ? filter(state)
		: !Object.entries(filter || {}).find(([key, value]) => state[key] !== value)
	return Object.fromEntries(Object.entries(object).filter(filterFunction))
}

function globalStorageListener (e: StorageEvent) {
	const partialKey = 'heartbeat:' + instance
	if (e.key?.slice(0, partialKey.length) === partialKey && e.newValue === '') {
		localStorage.setItem(e.key, 'ok')
	}
}

export async function hasStorageAccess () {
	if (document.hasStorageAccess && !await document.hasStorageAccess()) { return false }
	if (localStorage.getItem('global')) { return true }
}

export async function awaitStorageAccess () {
	while (!await hasStorageAccess()) { await new Promise(resolve => setTimeout(resolve, 1000)) }
}



cleanHeartbeats()
window.addEventListener('storage', globalStorageListener)
window.addEventListener('beforeunload', () => deleteChannel())