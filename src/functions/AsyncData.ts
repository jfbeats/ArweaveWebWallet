import { computed, isRef, Ref, ref, watchEffect, WatchStopHandle, WritableComputedRef } from 'vue'
import InterfaceStore from '@/store/InterfaceStore'

const globalClock = ref(0)
setInterval(() => globalClock.value++, 1000)

type AsyncDataOptions<T> = {
	query: () => Promise<T>
	seconds: number
	awaitEffect?: () => any
	completed?: () => any
	timestamp?: Ref<number | undefined>
	existingState?: Ref<T | undefined>
	processResult?: (params: T, options: AsyncDataOptions<T>) => void
}

type QueryStatusInterface<T> = {
	running: boolean
	promise?: Promise<T>
}

export function getAsyncData <T> (options: AsyncDataOptions<T>) {
	console.log('new async data request')
	const state = isRef(options.existingState) ? options.existingState : ref(options.existingState) as Ref<T | undefined>
	const timestamp = isRef(options.timestamp) ? options.timestamp : ref(options.timestamp) as Ref<number | undefined>
	const { query, queryStatus } = getQueryManager(options)
	const refresh = async () => {
		globalClock.value
		if (queryStatus.running) { timestamp.value = Date.now(); return }
		if (state.value != null && timestamp.value && Date.now() - timestamp.value < (options.seconds * 1000)) { return }
		getState()
	}
	const getState = async (force?: boolean) => {
		if (options.completed?.()) { return state.value! }
		if (queryStatus.promise && queryStatus.running) { timestamp.value = Date.now(); return queryStatus.promise }
		if (queryStatus.promise && !force && state.value != null && timestamp.value && Date.now() - timestamp.value < (options.seconds * 1000)) { return queryStatus.promise }
		const rollback = timestamp.value
		timestamp.value = Date.now()
		return new Promise<T>((resolve, reject) => {
			query().then(res => {
				timestamp.value = Date.now()
				options.processResult ? options.processResult(res, options) : state.value = res
				resolve(state.value!)
			}).catch(e => { timestamp.value = rollback; reject(e) })
		})
	}
	const computedState = computed({
		get () { refresh(); return state.value },
		set (value) { state.value = value }
	}) as WritableComputedRef<T | undefined>
	return { state: computedState, getState, queryStatus }
}

export function getQueryManager <T> (options: AsyncDataOptions<T>) {
	const queryStatus: QueryStatusInterface<T> = { running: false }
	const query = () => {
		if (queryStatus.running && queryStatus.promise) { return queryStatus.promise }
		queryStatus.running = true
		queryStatus.promise = new Promise<T>(async (resolve, reject) => {
			await awaitEffect(() => (options.awaitEffect ? options.awaitEffect() : true) && InterfaceStore.windowVisible)
			console.log(new Date(Date.now()).toTimeString(), options, queryStatus.promise)
			options.query().then(resolve).catch(reject).finally(() => queryStatus.running = false)
		})
		return queryStatus.promise
	}
	return { query, queryStatus }
}

export async function awaitEffect (effect: () => any) {
	let watchStop: WatchStopHandle
	return new Promise(resolve => {
		watchStop = watchEffect(() => {
			if (effect()) { resolve(true) }
		})
	}).then(() => { watchStop(); return true })
}