<template>
	<transition name="fade">
		<div v-if="updating" class="overlay"/>
	</transition>
	<transition name="fade-fast">
		<button type="button" class="update-available" v-if="needRefresh" @click="update()">
			{{ updating ? 'Updating...' : 'Update ready, click to reload' }}
		</button>
	</transition>
</template>



<script setup>
import { states } from '@/functions/Channels'
import { useRegisterSW } from 'virtual:pwa-register/vue'
import { ref, watch } from 'vue'

const { needRefresh, updateServiceWorker } = useRegisterSW()
let autoUpdateActive = true
setTimeout(() => autoUpdateActive = false, 6000)
const updating = ref(false)
const update = () => {
	updating.value = true
	updateServiceWorker()
}
watch(() => needRefresh.value, (needed) => {
	if (!needed || !autoUpdateActive || Object.keys(states).length) { return }
	update()
}, { immediate: true })
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