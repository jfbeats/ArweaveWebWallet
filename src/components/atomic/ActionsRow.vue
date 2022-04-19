<template>
	<transition name="fade-fast" mode="out-in">
		<div class="actions-row" :key="actionsComputed?.length">
			<button v-for="action in actionsComputed" class="action" @click="action.run" type="button">
				<Icon :icon="action.icon"/>
			</button>
		</div>
	</transition>
</template>



<script setup lang="ts">
import Icon from '@/components/atomic/Icon.vue'
import { computed } from 'vue'

const props = defineProps(['actions'])

const actionsComputed = computed(() => props.actions?.filter((action: any) => action) || [])
</script>



<style scoped>
.actions-row {
	display: flex;
	align-items: center;
	justify-content: center;
	transition: 0.3s ease;
}

.action {
	height: 100%;
	display: flex;
	align-items: center;
}

.icon {
	width: 2em;
}
</style>