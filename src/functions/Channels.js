import { reactive, watch, computed } from 'vue'

const hash = new URLSearchParams(window.location.hash.slice(1))
const origin = hash.get('origin')
const session = hash.get('session')
const appInfo = { name: hash.get('name'), logo: hash.get('logo') }
const instance = origin + Math.random().toString().slice(2)
const chPrefix = 'connectorState:'
const sharedPrefix = 'sharedState:'
const heartbeatPrefix = 'heartbeat:'
const stateChannel = chPrefix + instance
const { state, initChannel, closeChannel } = getChannel(instance, chPrefix)
const { states, initChannels, closeChannels } = getChannels(chPrefix)
const connectorChannels = getChannels(sharedPrefix)

export function initConnectorChannel () {
	if (!origin || !session) { return }
	const channel = getChannel(origin + session, sharedPrefix)
	if (!channel.state.origin) { Object.assign(channel.state, { origin, session, appInfo, wallet: null, timestamp: Date.now() }) }
	channel.deleteChannel = () => {
		channel.closeChannel()
		localStorage.removeItem(sharedPrefix + origin + session)
	}
	return channel
}

export { state, states, connectorChannels }



function getChannels (prefix) {
	const channels = {}
	const states = reactive({})
	const getInstanceNames = () => Object.entries(localStorage)
		.filter(([key, value]) => key.slice(0, prefix.length) === prefix)
		.map(([key, value]) => key.slice(prefix.length))
	const instanciate = async (name) => {
		channels[name] = null
		if (prefix === chPrefix && !(await heartbeat(name))) { close(name); return null }
		if (!Object.keys(channels).includes(name)) { return null }
		channels[name] = getChannel(name, prefix)
		channels[name].initChannel()
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
	const initChannels = () => {
		window.addEventListener('storage', storageListener)
		storageListener()
	}
	const closeChannels = () => {
		window.removeEventListener('storage', storageListener)
		for (const channel in channels) { close(channel) }
	}
	return { states, initChannels, closeChannels }
}

export function getChannel (instanceName, prefix) {
	const stateChannel = prefix + instanceName
	const mustWrite = instanceName === instance && prefix === chPrefix
	const state = reactive(mustWrite ? { origin, session } : {})
	const writeState = () => {
		const stateString = JSON.stringify(state)
		if (stateString === localStorage.getItem(stateChannel)) { return }
		localStorage.setItem(stateChannel, stateString)
	}
	let stopWrite
	const startWrite = () => stopWrite = watch(() => state, writeState, { deep: true })
	const update = (val) => {
		if (stopWrite) { stopWrite() }
		try { Object.assign(state, JSON.parse(val)) } catch (e) { console.error(e) }
		startWrite()
	}
	const storageListener = (e) => {
		if (e.key !== stateChannel || e.newValue === e.oldValue) { return }
		update(e.newValue)
	}
	const initChannel = () => {
		window.addEventListener('storage', storageListener)
		if (mustWrite) { writeState() }
		update(localStorage.getItem(stateChannel))
	}
	const closeChannel = () => {
		window.removeEventListener('storage', storageListener)
		if (stopWrite) { stopWrite() }
	}
	return { state, initChannel, closeChannel }
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

export function filterChannels (filter, object = states) {
	const filterFunction = ([key, state]) => typeof filter === 'function' ? filter(state)
		: !Object.entries(filter || {}).find(([key, value]) => state[key] !== value)
	return Object.fromEntries(Object.entries(object).filter(filterFunction))
}

function globalStorageListener (e) {
	const partialKey = heartbeatPrefix + instance
	if (e.key.slice(0, partialKey.length) === partialKey && e.newValue === '') {
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
	initChannel()
	initChannels()
	connectorChannels.initChannels()
}

function close () {
	window.removeEventListener('storage', globalStorageListener)
	closeChannel()
	closeChannels()
	connectorChannels.closeChannels()
	localStorage.removeItem(stateChannel)
}



cleanHeartbeats()
init()
window.addEventListener('beforeunload', close)