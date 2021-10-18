import { reactive, watch, computed } from 'vue'

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
const filterChannels = (filter) => Object.fromEntries(Object.entries(states).filter(([key, state]) =>
	!Object.entries(filter || {}).find(([key, value]) => typeof value === 'function' ? !value(state[key]) : state[key] !== value)))
const connectors = computed(() => filterChannels({ type: 'connector' }))
const clients = computed(() => filterChannels({ type: 'client' }))

export { origin, state, states, filterChannels, connectors, clients }



function getChannels () {
	const channels = {}
	const states = reactive({})
	const getInstanceNames = () => Object.entries(localStorage)
		.filter(([key, value]) => key.slice(0, chPrefix.length) === chPrefix)
		.map(([key, value]) => key.slice(chPrefix.length))
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
		const runningChannels = Object.keys(channels)
		const storageChannels = getInstanceNames()
		for (const channel of [...runningChannels, ...storageChannels]) {
			if (runningChannels.includes(channel) && storageChannels.includes(channel)) { continue }
			else if (storageChannels.includes(channel) && channel !== instance) { instanciate(channel) }
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

function getChannel (instanceName) {
	const stateChannel = chPrefix + instanceName
	const state = reactive({})
	let stop
	const start = () => {
		stop = watch(() => state, () => {
			const stateString = JSON.stringify(state)
			if (stateString === localStorage.getItem(stateChannel)) { return }
			localStorage.setItem(stateChannel, stateString)
		}, { deep: true })
	}
	const update = (val) => {
		if (stop) { stop() }
		try { Object.assign(state, JSON.parse(val)) } catch (e) { }
		start()
	}
	const storageListener = (e) => {
		if (e.key !== stateChannel || e.newValue === e.oldValue) { return }
		update(e.newValue)
	}
	const closeChannel = () => {
		window.removeEventListener('storage', storageListener)
		stop()
	}
	window.addEventListener('storage', storageListener)
	update(localStorage.getItem(stateChannel))
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
		const cleanupTimeout = setTimeout(() => heartbeatReturn(false), Math.max(60000, timeout || 0))
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

export async function instanceStartPromise (filter, timeout) {
	return new Promise(resolve => {
		const watchStop = watch(() => states, () => {
			const name = Object.keys(filterChannels(filter))[0]
			if (!name) { return }
			resolve(name)
			watchStop()
		}, { deep: true, immediate: true })
		if (timeout) { setTimeout(() => { resolve(false); watchStop() }, timeout) }
	})
}



cleanHeartbeats()
window.addEventListener('beforeunload', () => {
	window.removeEventListener('storage', globalStorageListener)
	closeChannel()
	closeChannels()
	localStorage.removeItem(stateChannel)
})