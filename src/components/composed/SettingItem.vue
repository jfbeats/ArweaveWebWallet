<template>
	<div class="setting-item" :class="{ 'flex-row': row }">
		<div>
			<div v-if="name" class="name">{{ name }}</div>
			<div v-if="!row" class="content">
				<slot />
			</div>
			<div v-if="description" class="description secondary-text">{{ description }}</div>
		</div>
		<div v-if="row">
			<slot />
		</div>
	</div>
</template>



<script setup lang="ts">
const props = defineProps<{
	name?: string
	description?: string
	row?: any
}>()
</script>



<style scoped>
.setting-item {
	justify-content: space-between;
	margin-bottom: 1.5rem;
}

.name {
	margin-bottom: 0.8rem;
}

.content {
	margin-bottom: 0.8rem;
}
</style>