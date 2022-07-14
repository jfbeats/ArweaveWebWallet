<template>
	<transition name="fade">
		<div v-if="overlay" class="overlay"/>
	</transition>
	<transition name="fade-fast">
		<button type="button" class="update-available" v-if="needRefresh" @click="triggerUpdate()">
			{{ overlay ? 'Updating...' : 'Update ready, click to reload' }}
		</button>
	</transition>
</template>



<script setup lang="ts">
// @ts-ignore
import { useRegisterSW } from 'virtual:pwa-register/vue'
import { state, states } from '@/functions/Channels'
import { track } from '@/store/Analytics'
import { computed, ref, watch } from 'vue'

const { needRefresh, updateServiceWorker } = useRegisterSW()
let autoUpdateActive = state.value.type !== 'iframe'
setTimeout(() => autoUpdateActive = false, 10000)
const overlay = ref(false)
const update = async () => {
	overlay.value = true
	if (state.value.origin) {
		const urlInfo = { origin: state.value.origin, session: state.value.session! }
		const url = new URL(location.href)
		url.hash = new URLSearchParams(urlInfo).toString()
		location.replace(url)
	}
	location.reload()
}
const triggerUpdate = async () => {
	overlay.value = true
	track.event('app', 'Update')
	await new Promise(res => {
		updateServiceWorker(false).then(res)
		setTimeout(res, 1000)
	})
	for (const key in states) { states[key].updating = true }
	state.value.updating = true
}
const otherInstance = computed(() => Object.values(states).find(s => !s.origin || s.origin !== state.value.origin && s.session !== state.value.session))
watch(needRefresh, needed => needed && !otherInstance.value && autoUpdateActive && triggerUpdate(), { immediate: true })
watch(() => state.value.updating, val => val && update(), { immediate: true })
const close = () => { needRefresh.value = false }
</script>



<style scoped>
.overlay {
	position: fixed;
	z-index: 10;
	top: 0;
	width: 100%;
	height: 100%;
	background: #08080888;
}

.update-available {
	position: fixed;
	z-index: 10;
	bottom: 0;
	background: var(--background);
	padding: var(--spacing);
	border-top: 0.5px solid var(--border);
	border-right: 0.5px solid var(--border);
	border-top-right-radius: var(--border-radius);
}
</style>