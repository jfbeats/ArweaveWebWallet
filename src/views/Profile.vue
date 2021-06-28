<template>
	<FoldingLayout :class="{ verticalContent }">
		<template #left>
			<div class="test-left">hello</div>
		</template>
		<template #right>
			<div class="test-right">hello</div>
		</template>
	</FoldingLayout>
</template>

<script>
import FoldingLayout from '@/components/FoldingLayout.vue'
import InterfaceStore from '@/store/InterfaceStore'
import { computed } from 'vue'

export default {
	components: { FoldingLayout },
	setup () {
		const verticalContent = computed(() => InterfaceStore.breakpoints.verticalContent)
		return { verticalContent }
	}
}
</script>

<style scoped>
.test-left {
	height: 180vh;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 1px solid #222;
}

.test-right {
	height: 160vh;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 1px solid #222;
}
</style>