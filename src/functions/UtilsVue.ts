import { computed, customRef, isRef, ref, Ref, ShallowRef, shallowRef, UnwrapRef } from 'vue'
import { useLink } from 'vue-router'
import { Emitter } from '@/functions/UtilsClass'

export function makeRef <T> (value: RefMaybe<T>) { return (isRef(value) ? value : ref(value)) as Ref<UnwrapRef<T>> }
export function makeShallowRef <T> (value: RefMaybe<T>) { return (isRef(value) ? value : shallowRef(value)) as ShallowRef<T> }

export function useDebouncedRef<T>(value: T, delay = 200) {
	let timeout: any
	return customRef((track, trigger) => {
		return {
			get() {
				track()
				return value
			},
			set(newValue: T) {
				clearTimeout(timeout)
				timeout = setTimeout(() => {
					value = newValue
					trigger()
				}, delay)
			}
		}
	})
}

export function createAction (actionInterface: RefMaybe<Action & { onClick?: (e?: MouseEvent) => any } | undefined>, forTemplate = false) {
	const action = makeRef(actionInterface)
	const routerParams = computed(() => ({ ...action.value, to: action.value?.to ?? '' }))
	const routerLink = useLink(routerParams.value)
	const hrefExternal = computed(() => {
		if (typeof action.value?.to === 'string') {
			try { new URL(action.value.to); return action.value.to } catch (e) {}
		}
	})
	const hrefRouter = computed(() => {
		if (action.value?.to && !hrefExternal.value) { return routerLink.href.value }
	})
	const runFunctions = computed(() => {
		if (action.value?.disabled || !action.value?.onClick && !action.value?.run && !action.value?.to) { return }
		return (e?: MouseEvent) => {
			try { action.value?.onClick?.(e) } catch (e) { console.error(e) }
			try { action.value?.run && action.value.run?.() } catch (e) { console.error(e) }
			try { hrefRouter.value && routerLink.navigate(e) } catch (e) { console.error(e) }
			try { hrefExternal.value && !forTemplate && window.open(hrefExternal.value, '_blank')} catch (e) { console.error(e) }
		}
	})
	const isActive = computed(() => routerLink.isActive.value)
	const isExactActive = computed(() => routerLink.isExactActive.value)
	return { hrefExternal, hrefRouter, isActive, isExactActive, runFunctions }
}

export function useList <T> (options: {
	key: (a: Widen<T>) => string
	sort: (a: Widen<T>, b: Widen<T>) => number
	prioritize: (a: Widen<T>, b: Widen<T>) => number
}) {
	const { key, sort, prioritize } = options
	const internalState = ref({} as { [key: string]: T[] })
	const state = computed({
		get: () => Object.values(internalState.value).map(e => e[0]).sort((a, b) => sort(a as Widen<T>, b as Widen<T>)),
		set: v => {
			const ids = v.map(e => key(e as Widen<T>))
			const rem = Object.entries(internalState.value).filter(([key, _]) => !ids.includes(key)).map(([_, val]) => val).flat()
			remove(rem); add(v) }
	})
	const emitter = new Emitter<{ add: T[], remove: T[] }>()
	const add = (els: T[]) => {
		if (!els.length) { return }
		emitter.emit('add', els)
		els.forEach(el => {
			const i = key(el as any)
			internalState.value[i] ??= []
			if (!internalState.value[i].includes(el)) { internalState.value[i].push(el) }
			if (internalState.value[i].length > 1) { internalState.value[i] = internalState.value[i].sort(prioritize as any) }
		})
	}
	const remove = (els: T[], force?: boolean) => {
		if (!els.length) { return }
		emitter.emit('remove', els)
		return els.forEach(el =>{
			const i = key(el as any)
			if (force) { return delete internalState.value[i] }
			if (!internalState.value[i]) { return }
			if (internalState.value[i].includes(el)) { internalState.value[i] = internalState.value[i].filter(e => e !== el) }
			if (!internalState.value[i].length) { delete internalState.value[i] }
		})
	}
	const find = (el: T): T[] | undefined => internalState.value[key(el as any)]?.find(e => e === el) && internalState.value[key(el as any)]
	return { ...options, state, internalState, emitter, add, remove, find }
}