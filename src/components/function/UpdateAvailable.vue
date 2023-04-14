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
import InterfaceStore from '@/store/InterfaceStore';
import { toRefs } from 'vue';

const { needRefresh, triggerUpdate, overlay } = toRefs(InterfaceStore)
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