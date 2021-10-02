<template>
	<div class="connection-card card flex-column">
		<div class="flex-row">
			<Icon class="page-logo" :icon="state.appInfo?.logo || require('@/assets/icons/connection.svg')" />
			<div>
				<div>{{ state.appInfo?.name || 'Connector' }}</div>
				<div class="secondary-text">{{ state.origin }}</div>
			</div>
		</div>
		<Tabs :tabs="tabs" v-model="currentTab" />
		<div>{{ currentTab }}</div>
		<div class="secondary-text">{{ state }}</div>
	</div>
</template>

<script>
import Tabs from '@/components/atomic/Tabs.vue'
import Icon from '@/components/atomic/Icon.vue'
import { ref } from 'vue'

export default {
	components: { Tabs, Icon },
	props: ['state'],
	setup () {
		const tabs = [
			{ name: 'Requests', color: 'var(--orange)' },
			{ name: 'Permissions', color: 'var(--green)' },
		]
		const currentTab = ref(tabs[0].name)
		return { tabs, currentTab }
	}
}
</script>

<style scoped>
.page-logo {
	width: 64px;
	height: 64px;
	background: var(--background);
	border-radius: var(--border-radius);
}

.flex-row {
	align-items: center;
}
</style>