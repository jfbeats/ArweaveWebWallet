import { reactive, watch, computed } from 'vue'

const hash = new URLSearchParams(window.location.hash.slice(1))
const origin = hash.get('origin')
const session = hash.get('session')
const appInfo = { name: hash.get('name'), logo: hash.get('logo') }
const instance = origin + Math.random().toString().slice(2)
const chPrefix = 'connectorState:'
const heartbeatPrefix = 'heartbeat:'
const stateChannel = chPrefix + instance
const stateInit = {
	origin,
	session,
	appInfo,
	wallet: null,
}
const { state, initChannel, closeChannel } = getChannel(instance)
const { states, initChannels, closeChannels } = getChannels()
const iframes = computed(() => filterChannels({ type: 'iframe' }))

export { state, states, iframes }



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

function getChannel (instanceName) {
	const stateChannel = chPrefix + instanceName
	const state = reactive(instanceName === instance ? stateInit : {})
	const writeState = () => {
		const stateString = JSON.stringify(state)
		if (stateString === localStorage.getItem(stateChannel)) { return }
		localStorage.setItem(stateChannel, stateString)
	}
	let stopWrite
	const startWrite = () => stopWrite = watch(() => state, writeState, { deep: true })
	const update = (val) => {
		if (stopWrite) { stopWrite() }
		try { Object.assign(state, JSON.parse(val)) } catch (e) { }
		startWrite()
	}
	const storageListener = (e) => {
		if (e.key !== stateChannel || e.newValue === e.oldValue) { return }
		update(e.newValue)
	}
	const initChannel = () => {
		window.addEventListener('storage', storageListener)
		if (instanceName === instance) { writeState() }
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

export function filterChannels (filter) {
	const filterFunction = ([key, state]) => typeof filter === 'function' ? filter(state)
		: !Object.entries(filter || {}).find(([key, value]) => state[key] !== value)
	return Object.fromEntries(Object.entries(states).filter(filterFunction))
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
}

function close () {
	window.removeEventListener('storage', globalStorageListener)
	closeChannel()
	closeChannels()
	localStorage.removeItem(stateChannel)
}



cleanHeartbeats()
init()
window.addEventListener('beforeunload', close)