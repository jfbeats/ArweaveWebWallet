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
import { useRegisterSW } from 'virtual:pwa-register/vue'
import { state, states } from '@/functions/Channels'
import { track } from '@/store/Telemetry'
import { computed, ref, watch } from 'vue'

const newLocation = sessionStorage.getItem('redirect')
if (newLocation) { sessionStorage.removeItem('redirect'); location.replace(newLocation) }

const { needRefresh, updateServiceWorker } = useRegisterSW({})
let autoUpdateActive = state.value.type !== 'iframe'
setTimeout(() => autoUpdateActive = false, 10000)
const overlay = ref(false)
const processUpdate = async () => {
	overlay.value = true
	if (state.value.origin) {
		const urlInfo = { origin: state.value.origin, session: state.value.session! }
		const url = new URL(location.href)
		url.hash = new URLSearchParams(urlInfo).toString()
		location.replace(url)
	}
	updateServiceWorker(true)
	state.value.updating = 'completed'
}
const triggerUpdate = async (e?: any) => {
	if (overlay.value) { return }
	overlay.value = true
	track.event('App Update')
	if (!e && state.value.redirect && state.value.url) { sessionStorage.setItem('redirect', state.value.url) }
	states.value.forEach(s => s.updating = 'scheduled')
}
const otherInstance = computed(() => states.value.filter(s => s !== state.value).find(s => !s.origin || s.origin !== state.value.origin && s.session !== state.value.session))
watch(needRefresh, needed => needed && !otherInstance.value && autoUpdateActive && triggerUpdate(), { immediate: true })
watch(() => state.value.updating, val => val === 'scheduled' && processUpdate(), { immediate: true })
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