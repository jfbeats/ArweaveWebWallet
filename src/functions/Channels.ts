import { getCurrentScope, onScopeDispose, watch, ref, effectScope, computed } from 'vue'
import type { EffectScope, Ref, WatchStopHandle } from 'vue'
import { useDataWrapper } from '@/functions/AsyncData'
import type { AppSettingsInterface } from '@/store/SettingsStore'
import type { MiningData } from '@/functions/Mining'

type PrefixTable = {
	'instanceState:': InstanceState
	'sharedState:': SharedState
	'connectionSettings:': ConnectionSettings
	wallets: WalletDataInterface[]
	currency: { rate?: string, currency: string, provider: string, timestamp?: number }
	gateway: string
	localGatewayTest: number
	bundler: string
	scannerCamera: string
	pwdTest: EncryptedContent | null
	pwdTestLock: number
	events: { [key: string]: any }
	ledgerSettings: { selectedTransport: string }
	appSettings: AppSettingsInterface
	cold: { status: 'active' | 'compromised', excluded: string[] }
	storagePrice: { [height: string]: string | undefined }
	miningData: MiningData
	miningDataTimestamp: number
}

type DefaultValue <T extends keyof PrefixTable> = PrefixTable[T] | undefined
type ChannelState <T extends keyof PrefixTable, U extends DefaultValue<T> | undefined> = U extends PrefixTable[T] ? Ref<PrefixTable[T]> : U extends undefined ? Ref<PrefixTable[T] | undefined> : never
type Result <T extends keyof PrefixTable, U extends DefaultValue<T>> = { state: ChannelState<T, U>, stop: () => void, deleteChannel: () => void }



function ChannelRef <T extends keyof PrefixTable, U extends DefaultValue<T> = undefined> (prefix: T, instanceName = '', init?: U, writeInit?: boolean): Result<T, U> {
	let stopWrite: WatchStopHandle
	let state = ref(init) as ChannelState<T, U>
	let stateChannel = prefix + instanceName
	
	const writeState = () => {
		if (state.value === undefined) {
			localStorage.removeItem(stateChannel)
			return update()
		}
		const stateString = JSON.stringify(state.value)
		if (stateString === localStorage.getItem(stateChannel)) { return }
		localStorage.setItem(stateChannel, stateString)
	}
	const startWrite = () => stopWrite = watch(state, writeState, { deep: true })
	const update = (val?: string | null) => {
		if (stopWrite) { stopWrite() }
		if (val == undefined || val === 'undefined') {
			if (init === undefined) { startWrite(); return }
			val = JSON.stringify(init)
		}
		state.value = JSON.parse(val)
		startWrite()
	}
	const storageListener = (e: StorageEvent) => {
		if (e.key !== stateChannel || e.newValue === e.oldValue || !e.newValue) { return }
		update(localStorage.getItem(stateChannel))
	}
	const stop = () => {
		window.removeEventListener('storage', storageListener)
		if (stopWrite) { stopWrite() }
	}
	const deleteChannel = () => { stop(); localStorage.removeItem(stateChannel) }
	
	window.addEventListener('storage', storageListener)
	if (writeInit && !localStorage.getItem(stateChannel)) {
		if (typeof state.value === 'object' && Object.keys(state).length) { writeState() }
		else if (state.value !== undefined) { writeState() }
	}
	update(localStorage.getItem(stateChannel))
	if (getCurrentScope()) { onScopeDispose(() => stop()) }
	
	return { state, stop, deleteChannel }
}



const channelInstances = {} as { [key: string]: { channel: ReturnType<typeof ChannelRef<any, any>>, subscribers: number, scope: EffectScope } }

export function useChannel <T extends keyof PrefixTable, U extends DefaultValue<T> = undefined> (prefix: T, instanceName = '', init?: U, writeInit?: boolean): Result<T, U> {
	const key = prefix + instanceName
	
	if (!channelInstances[key]) {
		const scope = effectScope(true)
		const channel = scope.run(() => ChannelRef(prefix, instanceName, init, writeInit))!
		channelInstances[key] = { channel, subscribers: 0, scope }
		globalStorageListener()
	}
	channelInstances[key].subscribers++
	
	const stop = () => { window.setTimeout(() => {
		channelInstances[key].subscribers--
		if (channelInstances[key].subscribers > 0) { return }
		channelInstances[key].scope.stop()
		delete channelInstances[key]
		globalStorageListener()
	})}
	const deleteChannel = () => {
		channelInstances[key]?.channel?.deleteChannel()
	}
	if (getCurrentScope()) { onScopeDispose(stop) }
	return { state: channelInstances[key].channel.state, stop, deleteChannel } as Result<T, U>
}



function getChannels <T extends 'instanceState:' | 'sharedState:'> (prefix: T) {
	const closeChannels = () => wrapper.value.forEach(ch => ch?.stop())
	const instantiate = async (name: string) => {
		if (prefix === 'instanceState:' && !(await heartbeat(name))) { return }
		return useChannel(prefix, name)
	}
	const instances = computed(() => storageKeys.value.filter(key => key.slice(0, prefix.length) === prefix).map(key => key.slice(prefix.length)))
	const wrapper = useDataWrapper(instances, item => item, instantiate, channel => channel?.stop())
	const states = computed(() => wrapper.value.filter(ch => ch?.state.value).map(ch => ch!.state.value!))
	return { states, closeChannels }
}



export function useLock (channel: Ref<number | undefined>) {
	let timer: any
	const isUsed = () => new Promise<boolean>(async res => {
		let hasChanged = false
		const stop = watch(channel, () => { hasChanged = true; res(true) })
		await new Promise(res => setTimeout(res, 1000))
		if (!hasChanged) { channel.value = 0; setTimeout(() => res(false)) }
		stop()
	})
	const lock = async () => {
		if (timer || channel.value && await isUsed()) { throw 'Feature already in use' }
		channel.value = 1
		timer = setInterval(() => channel.value!++, 1000)
	}
	const unlock = () => {
		clearInterval(timer)
		channel.value = 0
		timer = undefined
	}
	return { lock, unlock }
}



const url = window.location.href
const hash = new URLSearchParams(window.location.hash.slice(1))
const origin = hash.get('origin') || undefined
const session = hash.get('session') || undefined
const appInfo = { name: hash.get('name') || undefined, logo: hash.get('logo') || undefined }
const instance = origin + Math.random().toString().slice(2)
const storageKeys = ref(Object.keys(localStorage)) as Ref<string[]>
const { state, deleteChannel } = useChannel('instanceState:', instance, { origin, session, url }, true)
const { states } = getChannels('instanceState:')
watch(states, () => {})
const connectorChannels = getChannels('sharedState:')
export { state, states, connectorChannels, appInfo }



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
			if (!result) { localStorage.removeItem('instanceState:' + instanceName) }
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
		const relatedChannel = 'instanceState:' + key.slice('heartbeat:'.length)
		if (localStorage.getItem(relatedChannel)) { continue }
		localStorage.removeItem(key)
	}
}

function globalStorageListener (e?: StorageEvent) {
	const partialKey = 'heartbeat:' + instance
	if (e && e.key?.slice(0, partialKey.length) === partialKey && e.newValue === '') { localStorage.setItem(e.key, 'ok') }
	setTimeout(() => storageKeys.value = Object.keys(localStorage))
}

export async function hasStorageAccess () {
	if (document.hasStorageAccess && !await document.hasStorageAccess()) { return false }
	if (localStorage.getItem('global')) { return true }
}

export async function awaitStorageAccess () {
	while (!await hasStorageAccess()) { await new Promise(resolve => setTimeout(resolve, 1000)) }
}



cleanHeartbeats()
globalStorageListener()
window.addEventListener('storage', globalStorageListener)
window.addEventListener('beforeunload', () => deleteChannel())
window.addEventListener('unload', () => deleteChannel())