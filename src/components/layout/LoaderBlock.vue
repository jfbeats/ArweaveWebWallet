<template>
	<div class="loader-container">
		<Icon :icon="icon || 'loader'" />
	</div>
</template>



<script setup lang="ts">
import Icon from '@/components/atomic/Icon.vue'

const props = defineProps<{ icon?: any }>()
</script>



<style scoped>
.loader-container {
	min-height: 40vh;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 4em;
	color: #ffffff66;
}
</style>