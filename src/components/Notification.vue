<template>
	<div class="notification" :class="{ expanded: data.expanded }">
		<div class="flex-row">
			<div class="flex-row" style="flex: 1 1 0;">
				<IconBackground :icon="data.icon || require('@/assets/icons/notification.svg')" :img="data.img" />
				<div class="content">
					<Date v-if="data.expanded" class="secondary-text" :timestamp="data.timestamp" />
					<div class="title">{{ data.title }}</div>
					<div class="secondary-text"><slot /></div>
					<div v-if="data.expanded" class="actions flex-row">
						<button v-for="action in data.actions" :key="action.name" @click="action.run" type="button" class="action flex-row"><Icon :icon="action.img" /><div>{{ action.name }}</div></button>
					</div>
				</div>
			</div>
			<Expand v-model="data.expanded" />
		</div>
	</div>
</template>



<script>
import IconBackground from '@/components/atomic/IconBackground.vue'
import Icon from '@/components/atomic/Icon.vue'
import Date from '@/components/atomic/Date.vue'
import Expand from '@/components/atomic/Expand.vue'
import { ref } from 'vue'

export default {
	components: { IconBackground, Icon, Date, Expand },
	props: ['data'],
	setup (props) {	}
}
</script>



<style scoped>
.notification {
	--spacing-notification: 8px;
	--spacing: var(--spacing-notification);
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

.actions {
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

.expand {
	flex: 0 0 auto;
}

.flex-row > * {
	min-width: 0;
}
</style>