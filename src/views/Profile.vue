<template>
	<FoldingLayout>
		<template #left>
			<div class="test-left">Check back once profiles are added</div>
		</template>
		<template #right>
			<div class="test-right">Check back once profiles are added</div>
		</template>
	</FoldingLayout>
</template>

<script>
import FoldingLayout from '@/components/layout/FoldingLayout.vue'

export default {
	components: { FoldingLayout },
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