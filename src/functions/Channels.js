import { reactive, watchEffect, watch, computed } from 'vue'

const hash = new URLSearchParams(window.location.hash.slice(1))
const origin = hash.get('origin')
const appInfo = { name: hash.get('name'), logo: hash.get('logo') }
const instance = origin + Math.random().toString().slice(2)
const chPrefix = 'connectorState:'
const heartbeatPrefix = 'heartbeat:'
const stateChannel = chPrefix + instance
const stateInit = {
	origin,
	appInfo,
	wallet: null,
}
const globalStorageListener = (e) => {
	const partialKey = heartbeatPrefix + instance
	if (e.key.slice(0, partialKey.length) === partialKey && e.newValue === '') {
		localStorage.setItem(e.key, 'ok')
	}
}
window.addEventListener('storage', globalStorageListener)
localStorage.setItem(stateChannel, JSON.stringify(stateInit))
const { state, closeChannel } = getChannel(instance)
const { states, closeChannels } = getChannels()
const connectors = computed(() => Object.fromEntries(Object.entries(states).filter(([key, value]) => value.type === 'connector')))
const clients = computed(() => Object.fromEntries(Object.entries(states).filter(([key, value]) => value.type === 'client')))
export { origin, state, states, connectors, clients }



function getChannels () {
	const channels = {}
	const states = reactive({})
	const getInstanceNames = () => {
		const result = []
		for (const key in localStorage) {
			if (key.includes(chPrefix)) { result.push(key.slice(chPrefix.length)) }
		}
		return result
	}
	const instanciate = async (name) => {
		channels[name] = null
		if (!(await heartbeat(name))) { close(name); return null }
		if (!Object.keys(channels).includes(name)) { return null }
		channels[name] = getChannel(name)
		states[name] = channels[name].state
	}
	const close = (name) => {
		channels[name]?.closeChannel()
		delete channels[name]
		delete states[name]
	}
	const storageListener = () => {
		const storageChannels = getInstanceNames()
		for (const channel in channels) {
			if (storageChannels.includes(channel)) { continue }
			close(channel)
		}
		for (const storageChannel of storageChannels) {
			if (Object.keys(channels).includes(storageChannel) || storageChannel === instance) { continue }
			instanciate(storageChannel)
		}
	}
	window.addEventListener('storage', storageListener)
	const closeChannels = () => {
		window.removeEventListener('storage', storageListener)
		for (const instance in channels) { close(instance) }
	}
	storageListener()
	return { states, closeChannels }
}

function getChannel (instanceName) {
	const stateChannel = chPrefix + instanceName
	const state = reactive({})
	try { Object.assign(state, JSON.parse(localStorage.getItem(stateChannel))) } catch (e) { }
	const storageListener = (e) => {
		if (e.key !== stateChannel || e.newValue === e.oldValue) { return }
		try { Object.assign(state, JSON.parse(e.newValue)) } catch (e) { }
	}
	const stopUpdate = watchEffect(() => {
		if (JSON.stringify(state) === localStorage.getItem(stateChannel)) { return }
		localStorage.setItem(stateChannel, JSON.stringify(state))
	})
	window.addEventListener('storage', storageListener)
	const closeChannel = () => {
		window.removeEventListener('storage', storageListener)
		stopUpdate()
	}
	return { state, closeChannel }
}

async function heartbeat (instanceName, timeout) {
	if (instanceName === instance) { return true }
	const fullKey = heartbeatPrefix + instanceName + instance
	const promise = new Promise(resolve => {
		const heartbeatListener = async (e) => {
			if (e.key === fullKey && e.newValue) { heartbeatReturn(true) }
		}
		const heartbeatReturn = (result) => {
			if (result) { clearTimeout(cleanupTimeout) }
			setTimeout(() => localStorage.removeItem(fullKey), 1000)
			if (!result) { localStorage.removeItem(chPrefix + instanceName) }
			window.removeEventListener('storage', heartbeatListener)
			resolve(result)
		}
		window.addEventListener('storage', heartbeatListener)
		const cleanupTimeout = setTimeout(() => heartbeatReturn(false), 60000)
		if (timeout) { setTimeout(() => resolve(false), timeout) }
	})
	localStorage.setItem(fullKey, '')
	return promise
}

function cleanHeartbeats () {
	for (const key in localStorage) {
		if (!key.includes(heartbeatPrefix)) { continue }
		const relatedChannel = chPrefix + key.slice(heartbeatPrefix.length)
		if (localStorage.getItem(relatedChannel)) { continue }
		localStorage.removeItem(key)
	}
}

export async function instanceStartPromise (filter, timeout) {
	return new Promise(resolve => {
		const watchStop = watch(() => states, () => {
			const name = findInstance(filter)
			if (!name) { return }
			resolve(name)
			watchStop()
		}, { deep: true, immediate: true })
		if (timeout) { setTimeout(() => resolve(false), timeout) }
	})
}

export function findInstance (filter) {
	for (const name in states) {
		const currentInstance = states[name]
		if (!Object.entries(filter).find(attr => currentInstance[attr[0]] !== attr[1])) {
			return name
		}
	}
}



cleanHeartbeats()
window.addEventListener('beforeunload', () => {
	window.removeEventListener('storage', globalStorageListener)
	closeChannel()
	closeChannels()
	localStorage.removeItem(stateChannel)
})