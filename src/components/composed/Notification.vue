<template>
	<div class="notification expanded">
		<div class="flex-row">
			<div class="flex-row" style="flex: 1 1 0;">
				<div class="content">
					<Date v-if="data.expanded" class="secondary-text" :timestamp="data.timestamp" />
					<div class="title">{{ data.title }}</div>
					<div class="secondary-text">
						{{ data.description }}
					</div>
					<ActionsList :actions="data.actions"/>
				</div>
			</div>
<!--			<Expand v-model="data.expanded" />-->
		</div>
	</div>
</template>



<script setup lang="ts">
import Date from '@/components/atomic/Date.vue'
import Expand from '@/components/atomic/Expand.vue'
import ActionsList from '@/components/composed/ActionsList.vue';

const props = defineProps<{
	data: any
}>()
</script>



<style scoped>
.notification {
	--spacing-notification: 8px;
	--spacing: var(--spacing-notification);
	color: white;
}

.secondary-text {
	color: white;
}

.icon-background {
	flex: 0 0 auto;
	width: 52px;
	height: 52px;
	align-self: flex-start;
}

.title {
	font-size: 1.1em;
}

.content {
	flex: 1 1 0;
	min-width: 0;
}

.notification:not(.expanded) .content > * {
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
}

.expand {
	flex: 0 0 auto;
}

.flex-row > * {
	min-width: 0;
}
</style>