<template>
	<div class="connect flex-column">
		<Carousel :index="currentConnectorIndex" :options="{ align: 'start', overscroll: true }" class="connectors">
			<div v-if="!connectors.length && extensionOrigin" class="connection-card-container fade-list-item" style="position: relative">
				<OverlayPrompt :options="connectPrompt" />
			</div>
			<div v-for="connector in connectors" :key="connector.origin + connector.session" class="connection-card-container fade-list-item">
				<ConnectionCard :state="connector" class="box" />
			</div>
		</Carousel>
	</div>
</template>



<script setup lang="ts">
import Carousel from '@/components/layout/Carousel.vue'
import ConnectionCard from '@/components/composed/ConnectionCard.vue'
import OverlayPrompt from '@/components/layout/OverlayPrompt.vue'
import { state } from '@/functions/Channels'
import { connectors as unordered, postMessageExtension } from '@/functions/Connect'
import { computed, ref, watch } from 'vue'
import { ICON } from '@/store/Theme'

const connectors = computed(() => unordered.value.sort((a, b) => +(b.origin === 'local') - +(a.origin === 'local')))
const connectPrompt = computed(() => ({
	action: {
		icon: ICON.plug,
		name: 'Connect to ' + extensionOrigin.value,
		run: () => postMessageExtension('connect')
	}
}))

let loading = true
setTimeout(() => loading = false, 500)

const currentConnectorIndex = ref(-1)
watch(connectors, () => {
	const index = connectors.value.findIndex(connector => connector.origin === state.value.origin)
	if (!loading || index < 0 || currentConnectorIndex.value >= 0) { return }
	currentConnectorIndex.value = index
	loading = false
}, { immediate: true })

const extensionOrigin = ref()
postMessageExtension('state').then(res => {
	if (!res) { return }
	extensionOrigin.value = res.origin
	watch(() => connectors.value, () => {
		const index = connectors.value.findIndex(connector => connector.origin === extensionOrigin.value)
		if (index < 0 && currentConnectorIndex.value >= 0) { return currentConnectorIndex.value = index }
		if (currentConnectorIndex.value < 0) { return setTimeout(() => currentConnectorIndex.value = index) }
	}, { immediate: true })
})
</script>



<style scoped>
.connect {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.connectors {
	width: 100%;
	min-height: var(--current-vh);
}

.connection-card-container {
	height: var(--current-vh);
	width: var(--current-vw);
	max-width: var(--column-width-small);
	padding: 0;
	display: inline-block;
}

.connection-card {
	height: 100%;
}

.wallet {
	flex: 1 1 auto;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-evenly;
}

.address-icon {
	width: 128px;
	height: 128px;
	border-radius: var(--border-radius);
}

.bottom-info {
	position: absolute;
	bottom: 0;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
}

.fade-list-leave-active {
	position: absolute !important;
}

.fade-list-rise-leave-active {
	position: absolute !important;
}
</style>