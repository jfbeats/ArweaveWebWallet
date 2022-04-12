import { reactive, computed, effectScope, isRef, Ref, ref, watch, watchEffect, WatchStopHandle, WritableComputedRef, toRef, toRefs } from 'vue'
import InterfaceStore from '@/store/InterfaceStore'



const globalClock = ref(0)
setInterval(() => globalClock.value++, 1000)
watch(() => InterfaceStore.windowVisible, () => globalClock.value++)



type ReactiveQueryOptions<T, P> = Override<AsyncDataOptions<T>, {
	params: Ref<P>
	query: (params: NonNullable<P>) => Promise<T>
	existingState?: undefined
}>

type AsyncDataOptions<T> = QueryManagerOptions<T> & {
	seconds?: number
	stale?: (state: T | undefined) => any
	completed?: (state: T | undefined) => any
	timestamp?: Ref<number | undefined>
	existingState?: Ref<T | undefined>
	processResult?: (state: T, options: AsyncDataOptions<T>) => void
}

type QueryManagerOptions<T> = {
	name?: string
	query: () => Promise<T>
	awaitEffect?: () => any
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
		if (val == null) { return }
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
	const state = isRef(options.existingState) ? options.existingState : ref(options.existingState) as Ref<T | undefined>
	const timestamp = isRef(options.timestamp) ? options.timestamp : ref(options.timestamp) as Ref<number | undefined>
	let cooldown = 0
	const { query, queryStatus } = getQueryManager(options)
	const localClock = ref(0)
	const getState = async (force?: boolean) => {
		if (options.completed?.(state.value)) { return state.value! }
		if (queryStatus.promise && (queryStatus.running || cooldown)) { timestamp.value = Date.now(); return queryStatus.promise }
		if (!options.seconds || !force && state.value != null && timestamp.value && Date.now() - timestamp.value < (options.seconds * 1000)) { return state.value }
		const rollback = timestamp.value
		const initTimestamp = Date.now()
		timestamp.value = initTimestamp
		return new Promise<T>((resolve, reject) => {
			query().then(res => {
				timestamp.value = Date.now()
				if (!res) { throw new Error('not found') }
				options.processResult ? options.processResult(res, options) : state.value = res
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
		if (!options.seconds || !options.stale?.(state.value) && state.value != null && timestamp.value && Date.now() - timestamp.value < (options.seconds * 1000)) { return }
		localClock.value++
	}))
	const computedState = scope.run(() => computed({
		get () { localClock.value; getState(); return state.value },
		set (value) { state.value = value }
	})) as WritableComputedRef<T | undefined>
	return { state: computedState, stateRef: state, getState, queryStatus, stop: () => scope.stop() }
}

export function getQueryManager <T> (options: QueryManagerOptions<T>) {
	const queryStatus: QueryStatusInterface<T> = reactive({ running: false })
	const query = () => {
		if (queryStatus.running && queryStatus.promise) { return queryStatus.promise }
		queryStatus.running = true
		queryStatus.error = undefined
		queryStatus.promise = new Promise<T>(async (resolve, reject) => {
			if (options.awaitEffect) { await awaitEffect(() => options.awaitEffect?.()) }
			const query = options.query()
			query.then(resolve).catch(e => { queryStatus.error = e; reject(e) }).finally(() => queryStatus.running = false)
			query.then(res => console.log(new Date(Date.now()).toLocaleTimeString() + '\n', options.name, { options, res }))
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
