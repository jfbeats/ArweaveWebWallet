<template>
	<div class="icon-background">
		<Icon v-if="img" class="page-logo" :icon="img" />
		<Icon v-else class="page-logo placeholder" :icon="icon" />
	</div>
</template>



<script setup>
import Icon from '@/components/atomic/Icon.vue'
const props = defineProps(['icon', 'img'])
</script>



<style scoped>
.icon-background {
	background: var(--background);
	border-radius: var(--border-radius);
	overflow: hidden;
	width: 64px;
	height: 64px;
}

.page-logo {
	width: 100%;
	height: 100%;
}

.page-logo.placeholder {
	padding: 10%;
	opacity: 0.75;
}
</style>