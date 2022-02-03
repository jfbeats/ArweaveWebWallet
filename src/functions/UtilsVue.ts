import { customRef } from 'vue'

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