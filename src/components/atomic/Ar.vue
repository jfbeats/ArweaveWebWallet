<template>
	<transition name="fade-fast" mode="out-in">
		<span class="ar" :key="amountRounded">
			{{ amountRounded || '' }}
			<span v-if="amountRounded" class="symbol">AR</span>
		</span>
	</transition>
</template>



<script setup lang="ts">
import { computed } from 'vue'
import { round } from '@/functions/Utils'
import { normalizeTo } from '@/store/ArweaveStore'

const props = defineProps<{
	ar?: string | number
	winston?: string | number
}>()
const amountRounded = computed(() => round(normalizeTo('ar', props)))
</script>



<style scoped>
.ar {
	white-space: nowrap;
	display: inline-block;
}

.ar::before {
	content: "\200b";
}

.symbol {
	font-size: 0.75em;
}
</style>
