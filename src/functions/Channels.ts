import { getCurrentScope, onScopeDispose, reactive, watch, ref, effectScope } from 'vue'
import type { EffectScope, Ref, WatchStopHandle } from 'vue'

type PrefixTable = {
	'connectorState:': InstanceState
	'sharedState:': ConnectorState
	'connectionSettings:': ConnectionSettings
	wallets: WalletDataInterface[]
	currency: { rate?: string, currency: string, provider: string, timestamp?: number }
}

export class Channel <T extends keyof PrefixTable> { // Todo replace with ref version
	state
	private readonly stateChannel
	private stopWrite?: WatchStopHandle
	
	constructor (prefix: T, instanceName = '', init: Partial<PrefixTable[T]>) {
		this.state = reactive(init)
		this.stateChannel = prefix + instanceName
		window.addEventListener('storage', this.storageListener)
		if (!localStorage.getItem(this.stateChannel) && Object.keys(this.state).length) { this.writeState() }
		this.update(localStorage.getItem(this.stateChannel))
		if (getCurrentScope()) { onScopeDispose(() => this.destructor()) }
	}
	destructor = () => {
		window.removeEventListener('storage', this.storageListener)
		if (this.stopWrite) { this.stopWrite() }
	}
	
	private writeState = () => {
		const stateString = JSON.stringify(this.state)
		if (stateString === localStorage.getItem(this.stateChannel)) { return }
		localStorage.setItem(this.stateChannel, stateString)
	}
	private startWrite = () => this.stopWrite = watch(() => this.state, this.writeState, { deep: true })
	private update = (val: string | null) => {
		if (this.stopWrite) { this.stopWrite() }
		if (val) { this.set(JSON.parse(val)) }
		this.startWrite()
	}
	private storageListener = (e: StorageEvent) => {
		if (e.key !== this.stateChannel || e.newValue === e.oldValue || !e.newValue) { return }
		this.update(e.newValue)
	}
	set = (newState: PrefixTable[T]) => {
		if (!newState) { return }
		if (Array.isArray(this.state) && Array.isArray(newState)) { this.state.splice(0, this.state.length, ...newState) }
		else if (typeof this.state === 'object' && typeof newState === 'object') {
			for (const key in this.state) { !(key in newState) && delete this.state[key] }
			Object.assign(this.state, newState)
		}
	}
	deleteChannel = () => {
		this.destructor()
		localStorage.removeItem(this.stateChannel)
	}
}


export class ChannelRef <T extends keyof PrefixTable> {
	state
	private readonly stateChannel
	private stopWrite?: WatchStopHandle
	
	constructor (prefix: T, instanceName = '', init: PrefixTable[T]) {
		this.state = ref(init) as Ref<PrefixTable[T]>
		this.stateChannel = prefix + instanceName
		window.addEventListener('storage', this.storageListener)
		if (!localStorage.getItem(this.stateChannel)) {
			if (typeof this.state.value === 'object' && Object.keys(this.state).length) { this.writeState() }
			else if (this.state.value != null) { this.writeState() }
		}
		this.update(localStorage.getItem(this.stateChannel))
		if (getCurrentScope()) { onScopeDispose(() => this.destructor()) }
	}
	destructor = () => {
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
		this.destructor()
		localStorage.removeItem(this.stateChannel)
	}
}

const channelInstances = {} as { [key: string]: { channel: ChannelRef<any>, subscribers: number, scope: EffectScope } }
export function useChannel <T extends keyof PrefixTable> (prefix: T, instanceName = '', init: PrefixTable[T]) {
	const key = prefix + instanceName
	
	if (!channelInstances[key]) {
		const scope = effectScope(true)
		const channel = scope.run(() => new ChannelRef(prefix, instanceName, init))!
		channelInstances[key] = { channel, subscribers: 0, scope }
	}
	channelInstances[key].subscribers++
	console.log(channelInstances[key].subscribers)
	
	const stop = () => {
		channelInstances[key].subscribers--
		console.log(channelInstances[key].subscribers)
		if (channelInstances[key].subscribers  > 0) { return }
		channelInstances[key].scope.stop()
		delete channelInstances[key]
	}
	if (getCurrentScope()) { onScopeDispose(stop) }
	return { state: channelInstances[key].channel.state, stop }
}



const hash = new URLSearchParams(window.location.hash.slice(1))
const origin = hash.get('origin') || undefined
const session = hash.get('session') || undefined
const appInfo = { name: hash.get('name') || undefined, logo: hash.get('logo') || undefined }
const instance = origin + Math.random().toString().slice(2)
const chPrefix = 'connectorState:'
const sharedPrefix = 'sharedState:'
const heartbeatPrefix = 'heartbeat:'
const stateChannel = chPrefix + instance
const { state, destructor } = new Channel(chPrefix, instance, { origin, session })
const { states, closeChannels } = getChannels(chPrefix)
const connectorChannels = getChannels(sharedPrefix)

export function initConnectorChannel () {
	if (!origin) { throw 'Missing origin' }
	const channel = new Channel(sharedPrefix, origin + session, {})
	if (!channel.state.origin) { channel.set({ origin, session, appInfo, timestamp: Date.now(), messageQueue: [] }) }
	return channel as Override<typeof channel, { state: ConnectorState }>
}

export { state, states, connectorChannels }






function getChannels <T extends 'connectorState:' | 'sharedState:'> (prefix: T) {
	const channels: { [key: string]: Channel<T> | undefined } = {}
	const states: { [key: string]: Channel<T>['state'] } = reactive({})
	const getInstanceNames = () => Object.entries(localStorage)
		.filter(([key, value]) => key.slice(0, prefix.length) === prefix)
		.map(([key, value]) => key.slice(prefix.length))
	const instantiate = async (name: string) => {
		channels[name] = undefined
		if (prefix === chPrefix && !(await heartbeat(name))) { close(name); return null }
		if (!Object.keys(channels).includes(name)) { return null }
		channels[name] = new Channel(prefix, name, {})
		states[name] = channels[name]!.state
	}
	const close = (name: string) => {
		channels[name]?.destructor()
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
	const fullKey = heartbeatPrefix + instanceName + instance
	const promise = new Promise(resolve => {
		const heartbeatListener = async (e: StorageEvent) => {
			if (e.key === fullKey && e.newValue) { heartbeatReturn(true) }
		}
		const heartbeatReturn = (result: boolean) => {
			if (result) { clearTimeout(cleanupTimeout) }
			setTimeout(() => localStorage.removeItem(fullKey), 1000)
			if (!result) { localStorage.removeItem(chPrefix + instanceName) }
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
		if (key.slice(0, heartbeatPrefix.length) !== heartbeatPrefix) { continue }
		const relatedChannel = chPrefix + key.slice(heartbeatPrefix.length)
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
	const partialKey = heartbeatPrefix + instance
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

async function init () {
	await awaitStorageAccess()
	window.addEventListener('storage', globalStorageListener)
}

function close () {
	window.removeEventListener('storage', globalStorageListener)
	destructor()
	closeChannels()
	connectorChannels.closeChannels()
	localStorage.removeItem(stateChannel)
}



cleanHeartbeats()
init()
window.addEventListener('beforeunload', close)