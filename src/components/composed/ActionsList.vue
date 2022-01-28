<template>
	<div class="actions-list flex-row">
		<button v-for="action in actions" :key="action.name" @click="action.run" type="button"
		        class="action flex-row">
			<Icon :icon="action.icon"/>
			<div>{{ action.name }}</div>
		</button>
	</div>
</template>



<script setup lang="ts">
import Icon from '@/components/atomic/Icon.vue'
const props = defineProps<{ actions: Action[] }>()
</script>



<style scoped>
.actions-list {
	--spacing-notification: 8px;
	--spacing: var(--spacing-notification);
	padding-top: 0.5em;
	font-size: 0.9em;
}

.action {
	--spacing: var(--spacing-default);
	align-items: center;
}

.action > * {
	--spacing: var(--spacing-notification);
}

.flex-row > * {
	min-width: 0;
}
</style>