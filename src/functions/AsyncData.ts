import { reactive, computed, effectScope, Ref, ref, watch, watchEffect, WatchStopHandle, WritableComputedRef, shallowReactive } from 'vue'
import InterfaceStore from '@/store/InterfaceStore'
import { makeShallowRef } from '@/functions/UtilsVue'



const globalClock = ref(0)
setInterval(() => globalClock.value++, 1000)
watch(() => InterfaceStore.windowVisible, () => globalClock.value++)



type ReactiveQueryOptions<T, P> = Override<AsyncDataOptions<T>, {
	params: Ref<P>
	query: (params: NonNullable<P>) => Promise<T>
	existingState?: undefined
}>

type AsyncDataOptions<T> = QueryManagerOptions<T> & {
	seconds?: RefMaybe<number>
	stale?: (state: T | undefined) => any
	completed?: (state: T | undefined) => any
	timestamp?: Ref<number | undefined>
	existingState?: Ref<T | undefined>
	processResult?: (state: T, options: AsyncDataOptions<T>) => T | Null
}

type QueryManagerOptions<T> = {
	name?: string
	query: () => Promise<T>
	awaitEffect?: () => any
	log?: false
}

type QueryStatusInterface<T> = {
	running: boolean
	promise?: Promise<T>
	error?: string
}



export function getReactiveAsyncData <T, P> (options: ReactiveQueryOptions<T, P>) {
	const { query, params, ...newOptions } = options
	const state = ref<T | undefined>()
	watch(params, (val, oldVal) => {
		if (val == undefined) { return }
		if (JSON.stringify(val) === JSON.stringify(oldVal)) { return }
		state.value = undefined
	}, { immediate: true, deep: true })
	const asyncDataOptions: AsyncDataOptions<T> = {
		...newOptions,
		query: () => query(params.value!),
		existingState: state
	}
	return getAsyncData<T>(asyncDataOptions)
}

export function getAsyncData <T> (options: AsyncDataOptions<T>) {
	const state = makeShallowRef(options.existingState)
	const timestamp = makeShallowRef(options.timestamp)
	const seconds = makeShallowRef(options.seconds)
	let cooldown = 0
	const { query, queryStatus } = getQueryManager({ ...options, log: false })
	const localClock = ref(0)
	const getState = async (force?: boolean) => {
		if (options.completed?.(state.value)) { return state.value! }
		if (queryStatus.promise && (queryStatus.running || cooldown)) { timestamp.value = Date.now(); return queryStatus.promise }
		if (!seconds.value || !force && state.value != undefined && timestamp.value && Date.now() - timestamp.value < (seconds.value * 1000)) { return state.value }
		const rollback = timestamp.value
		const initTimestamp = Date.now()
		timestamp.value = initTimestamp
		return new Promise<T>((resolve, reject) => {
			query().then(res => {
				timestamp.value = Date.now()
				if (res != undefined || !options.processResult) { state.value = res }
				if (res == undefined && !options.processResult) { throw new Error(options.name + ' query found nothing') }
				log(options, state.value)
				resolve(state.value!)
			}).catch(e => {
				cooldown = Math.max(0, 20000 - (Date.now() - initTimestamp))
				setTimeout(() => { cooldown = 0; timestamp.value = rollback; reject(e) }, cooldown)
			})
		})
	}
	const scope = effectScope()
	scope.run(() => watch(globalClock, () => {
		if (options.completed?.(state.value)) { return }
		if (!InterfaceStore.windowVisible) { return }
		if (queryStatus.running) { timestamp.value = Date.now(); return }
		if (!seconds.value || !options.stale?.(state.value) && state.value != undefined && timestamp.value && Date.now() - timestamp.value < (seconds.value * 1000)) { return }
		localClock.value++
	}))
	const computedState = scope.run(() => computed({
		get () { localClock.value; getState(); return state.value },
		set (value) { state.value = value }
	})) as WritableComputedRef<T | undefined>
	return { state: computedState, stateRef: state, getState, queryStatus, stop: () => scope.stop() }
}

export function getQueryManager <T> (options: QueryManagerOptions<T>) {
	const parentOptions = options as AsyncDataOptions<T>
	const queryStatus: QueryStatusInterface<T> = reactive({ running: false })
	const query = () => {
		if (queryStatus.running && queryStatus.promise) { return queryStatus.promise }
		queryStatus.running = true
		queryStatus.error = undefined
		queryStatus.promise = new Promise<T>(async (resolve, reject) => {
			if (options.awaitEffect) { await awaitEffect(() => options.awaitEffect?.()) }
			const queryRes = options.query()
			const process = (res: T) => {
				const result = parentOptions.processResult ? parentOptions.processResult(res, options) as T : res
				return result
			}
			const query = queryRes.then(process)
			query.then(resolve).catch(e => { queryStatus.error = e; reject(e) }).finally(() => queryStatus.running = false)
			if (options.log !== false) { query.then(res => log(options, res)) }
		})
		return queryStatus.promise
	}
	return { query, queryStatus }
}



function log (options: Partial<AsyncDataOptions<any>>, res: any) {
	console.log(new Date(Date.now()).toLocaleTimeString() + '\n', options.name, { options, res })
}



export function awaitEffect (effect: () => any) {
	let watchStop: WatchStopHandle
	return new Promise(resolve => {
		watchStop = watchEffect(() => {
			if (effect()) { resolve(true) }
		})
	}).then(() => { watchStop(); return true })
}



export function computedAsync <T> (query: () => T | Promise<T>) {
	const state = ref() as Ref<T | undefined>
	const request = ref(-1)
	const feedback = ref(-2)
	let n = 0
	watchEffect(async () => {
		request.value = n
		if (feedback.value !== request.value) { return }
		const currentN = ++n
		const result = await query()
		if (currentN === n) { state.value = result }
	})
	return computed(() => {
		feedback.value = request.value
		return state.value
	})
}



function isPromise <T> (param: T | Promise<T>): param is Promise<T> {
	return typeof param === 'object' && typeof (param as any).then === 'function'
}



export function useDataWrapper <SourceType, RuntimeType> (
	source: Ref<SourceType[]>,
	identify: (item: SourceType) => string,
	constructor: (source: SourceType) => RuntimeType | Promise<RuntimeType>,
	destructor?: (runtime: RuntimeType) => any,
) {
	type StoreEntry = { id: string, promise: Promise<RuntimeType>, runtimeItem?: RuntimeType }
	const Store = ref([]) as Ref<StoreEntry[]>
	return computed<RuntimeType[]>({
		get () {
			const runtimeData = Store.value.map(r => r.id)
			const sourceData = source.value.map(s => identify(s))
			for (const id of [...runtimeData, ...sourceData]) {
				if (runtimeData.includes(id) && !sourceData.includes(id)) {
					const index = Store.value.findIndex(r => r.id === id)!
					Store.value[index].promise.then(runtimeItem => destructor?.(runtimeItem))
					Store.value.splice(index, 1)
				}
				if (!runtimeData.includes(id) && sourceData.includes(id)) {
					const sourceEntry = source.value.find(w => identify(w) === id)!
					const runtimeItem = constructor(sourceEntry)
					if (isPromise(runtimeItem)) {
						const storeEntry: StoreEntry = shallowReactive({ id, promise: runtimeItem.then(runtimeItem => storeEntry.runtimeItem = runtimeItem) })
						Store.value.push(storeEntry)
					} else {
						const storeEntry: StoreEntry = shallowReactive({ id, promise: Promise.resolve(runtimeItem), runtimeItem })
						Store.value.push(storeEntry)
					}
				}
			}
			Store.value = Store.value.sort((a, b) => source.value.findIndex(s => identify(s) === a.id) - source.value.findIndex(s => identify(s) === b.id))
			return Store.value.map(r => r.runtimeItem).filter(r => r !== undefined) as RuntimeType[]
		},
		set (value) {
			source.value = source.value.filter(s => {
				const storeEntry = Store.value.find(r => identify(s) === r.id)
				if (!storeEntry) { return }
				return !storeEntry.runtimeItem || value.find(r => r === storeEntry.runtimeItem)
			}).sort((a, b) => value.findIndex(r => r === Store.value.find(s => s.id === identify(a))?.runtimeItem) - value.findIndex(r => r === Store.value.find(s => s.id === identify(b))?.runtimeItem))
		}
	})
}
