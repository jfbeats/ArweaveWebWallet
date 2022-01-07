import { computed, effectScope, isRef, Ref, ref, watch, watchEffect, WatchStopHandle, WritableComputedRef } from 'vue'
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
	const localClock = ref(0)
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
	const scope = effectScope()
	scope.run(() => watch(globalClock, () => {
		if (queryStatus.running) { timestamp.value = Date.now(); return }
		if (options.completed?.()) { return }
		if (state.value != null && timestamp.value && Date.now() - timestamp.value < (options.seconds * 1000)) { return }
		localClock.value++
	}))
	const computedState = scope.run(() => computed({
		get () { localClock.value; getState(); return state.value },
		set (value) { state.value = value }
	})) as WritableComputedRef<T | undefined>
	return { state: computedState, getState, queryStatus, stop: scope.stop }
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



export function awaitEffect (effect: () => any) {
	let watchStop: WatchStopHandle
	return new Promise(resolve => {
		watchStop = watchEffect(() => {
			if (effect()) { resolve(true) }
		})
	}).then(() => { watchStop(); return true })
}



export function useDataWrapper <
	SourceType extends { [key in Id]: string },
	RuntimeType,
	Id extends string,
> (
	source: Ref<SourceType[]>,
	key: Id,
	constructor: (source: SourceType) => RuntimeType,
	destructor?: (runtime: RuntimeType) => any,
) {
	const Store: { [id: string]: RuntimeType } = {}
	return computed<RuntimeType[]>({
		get () {
			const runtimeData = Object.keys(Store)
			const sourceData = source.value.map(w => w[key] + '')
			for (const id of [...runtimeData, ...sourceData]) {
				if (runtimeData.includes(id) && !sourceData.includes(id)) {
					destructor?.(Store[id])
					delete Store[id]
				}
				if (!runtimeData.includes(id) && sourceData.includes(id)) {
					const sourceEntry = source.value.find(w => w[key] == id)!
					Store[id] = constructor(sourceEntry)
				}
			}
			return Object.entries(Store).sort((a, b) => source.value.findIndex(s => s[key] == a[0]) - source.value.findIndex(s => s[key] == b[0])).map(e => e[1])
		},
		set (value) {
			source.value = source.value.filter(s => value.find(r => r === Store[s[key]]))
			.sort((a, b) => value.findIndex(r => r === Store[a[key]]) - value.findIndex(r => r === Store[b[key]]))
		}
	})
}
