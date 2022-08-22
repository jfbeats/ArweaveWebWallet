<template>
	<div class="setting-item" :class="{ 'flex-row': row }">
		<div>
			<Link :to="to">
				<div v-if="name" class="name">
					<Icon v-if="icon" :icon="icon" style="margin-inline-end: 1em"/>
					<div>{{ name }}</div>
				</div>
			</Link>
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
import Icon from '@/components/atomic/Icon.vue'
import Link from '@/components/function/Link.vue'
import { computed } from 'vue'

const props = defineProps<{
	description?: string
	row?: any
	
	// Todo type action
	name?: string
	icon?: Icon
	color?: string
	run?: Function
	to?: import('vue-router').RouteLocationRaw
	disabled?: any
}>()

const gap = computed(() => !props.to && '0.8rem')
</script>



<style scoped>
.setting-item {
	justify-content: space-between;
	margin-bottom: 1.5rem;
}

.name {
	margin-bottom: v-bind(gap);
	display: flex;
	align-items: center;
}

.content {
	margin-bottom: v-bind(gap);
}
</style>