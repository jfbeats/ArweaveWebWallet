<template>
	<button type="button" class="update-available" v-if="needRefresh" @click="updateServiceWorker()">Update ready, click to reload</button>
</template>



<script>
import { useRegisterSW } from 'virtual:pwa-register/vue'

export default {
	setup () {
		const { needRefresh, updateServiceWorker } = useRegisterSW()
		const close = () => { needRefresh.value = false }
		return { needRefresh, updateServiceWorker, close }
	}
}
</script>



<style scoped>
.update-available {
	position: fixed;
	z-index: 10;
	bottom: 0;
	background: var(--background);
	padding: var(--spacing) var(--spacing) var(--spacing) 0;
	border-top: 0.5px solid var(--border);
	border-right: 0.5px solid var(--border);
	border-top-right-radius: var(--border-radius);
}
</style>