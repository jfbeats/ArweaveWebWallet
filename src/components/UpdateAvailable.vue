<template>
	<button type="button" class="update-available" v-if="needRefresh" @click="updateServiceWorker()">
		Update ready, click to reload
	</button>
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
	position: absolute;
	z-index: 10;
	bottom: 0;
	left: 80px;
	background: var(--background);
	padding: var(--spacing);
	border-top: 0.5px solid var(--border);
	border-right: 0.5px solid var(--border);
	border-top-right-radius: var(--border-radius);
}
</style>