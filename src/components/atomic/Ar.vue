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

const props = defineProps(['ar'])
const amountRounded = computed(() => round(props.ar))
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
