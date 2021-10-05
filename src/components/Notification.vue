<template>
	<div class="notification" :class="{ expanded }">
		<div class="flex-row">
			<div class="flex-row">
				<IconBackground :icon="icon || require('@/assets/icons/notification.svg')" :img="img" />
				<div class="content">
					<div v-if="expanded" class="secondary-text">Date</div>
					<div class="title">Notification example</div>
					<div class="secondary-text">Notif info Notif info Notif info Notif info Notif info Notif info Notif info Notif info Notif info Notif info Notif info Notif infoNotif info Notif info Notif info Notif info Notif info</div>
					<div v-if="expanded" class="actions flex-row">
						Actions
					</div>
				</div>
			</div>
			<Expand v-model="expanded" />
		</div>
	</div>
</template>



<script>
import IconBackground from '@/components/atomic/IconBackground.vue'
import Icon from '@/components/atomic/Icon.vue'
import Expand from '@/components/atomic/Expand.vue'
import { ref } from 'vue'

export default {
	components: { IconBackground, Icon, Expand },
	props: ['icon', 'img'],
	setup () {
		const expanded = ref(true)

		return { expanded }
	}
}
</script>



<style scoped>
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

.expand {
	flex: 0 0 auto;
}

.flex-row > * {
	min-width: 0;
}
</style>