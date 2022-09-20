import { computed, customRef, isRef, ref, Ref } from 'vue'
import { useLink } from 'vue-router'

export function toRef <T> (value: RefMaybe<T>) {
	return isRef(value) ? value : ref(value) as Ref<T>
}

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
	const action = toRef(actionInterface)
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
			try { action.value?.run?.() } catch (e) { console.error(e) }
			try { hrefRouter.value && routerLink.navigate(e) } catch (e) { console.error(e) }
			try { hrefExternal.value && !forTemplate && window.open(hrefExternal.value, '_blank')} catch (e) { console.error(e) }
		}
	})
	const isActive = computed(() => routerLink.isActive.value)
	const isExactActive = computed(() => routerLink.isExactActive.value)
	return { hrefExternal, hrefRouter, isActive, isExactActive, runFunctions }
}