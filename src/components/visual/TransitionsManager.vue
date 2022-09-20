<template>
	<transition :name="name" mode="out-in" @before-enter="transitionState.enter = true; emitter.emit('scrollHistory')" @after-enter="transitionState.enter = false" @before-leave="transitionState.leave = true" @after-leave="transitionState.leave = false">
		<slot />
	</transition>
</template>



<script setup lang="ts">
import { computed, provide, inject, readonly, watch, reactive } from 'vue'
import { emitter } from '@/store/InterfaceStore'

const props = defineProps<{
	axis?: 'x' | 'y'
	vector?: number
	fast?: boolean
}>()

const name = computed<string>(() => {
	if (props.vector == null || props.vector === 0) { return props.fast ? 'fade-fast' : 'fade' }
	if (props.axis === 'x') { return props.vector > 0 ? 'slide-left' : 'slide-right' }
	else { return props.vector > 0 ? 'slide-up' : 'slide-down' }
})

const parentTransitionState = inject('transitionState', null as null | typeof transitionState)
const transitionState = reactive({ running: false, enter: false, leave: false })
const providedState = reactive({})
watch(() => [transitionState, parentTransitionState], () => {
	transitionState.running = transitionState.enter || transitionState.leave // @ts-ignore
	for (const key in transitionState) { providedState[key] = transitionState[key] || parentTransitionState?.[key] || false }
}, { immediate: true, deep: true })
provide('transitionState', readonly(providedState))
</script>