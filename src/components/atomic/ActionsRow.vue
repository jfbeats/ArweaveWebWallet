<template>
	<transition name="fade-fast" mode="out-in">
		<div class="actions-row" :key="actionsComputed?.length">
			<Link v-for="action in actionsComputed" v-bind="action" class="action">
				<Icon v-if="action.icon" :icon="action.icon" />
			</Link>
		</div>
	</transition>
</template>



<script setup lang="ts">
import Link from '@/components/function/Link.vue'
import Icon from '@/components/atomic/Icon.vue'
import { computed } from 'vue'

const props = defineProps<{ actions?: Array<Action | undefined> }>()

const actionsComputed = computed(() => props.actions?.filter((action): action is Action => !!action) || [])
</script>



<style scoped>
.actions-row {
	display: flex;
	align-items: center;
	justify-content: center;
}

.action {
	height: 100%;
	display: flex;
	align-items: center;
}

.icon {
	margin: var(--spacing);
}
</style>