<template>
	<div class="wallet">
		<router-view v-slot="{ Component }">
			<FoldingLayout v-if="wallet" :leftVector="$route.meta.transition?.nameWallet" :rightVector="contentTransitionFactor" :rightAxis="contentTransitionAxis">
				<template #left>
					<div class="user-info flex-column" :key="wallet.key">
						<Balance :wallet="wallet" />
						<div class="actions">
							<Action v-for="action in actions" :key="action.name" :to="{ name: action.name, query: { ...$route.query } }" :icon="action.icon" replace>{{ action.text }}</Action>
						</div>
					</div>
				</template>
				<template #right>
					<div :key="contentKey" class="router-view">
						<component :is="Component" />
					</div>
				</template>
			</FoldingLayout>
		</router-view>
	</div>
</template>



<script setup>
import FoldingLayout from '@/components/layout/FoldingLayout.vue'
import Balance from '@/components/composed/Balance.vue'
import Action from '@/components/atomic/Action.vue'
import InterfaceStore from '@/store/InterfaceStore'
import { toRef, computed } from 'vue'
import { useRoute } from 'vue-router'

import IconNorthEast from '@/assets/icons/north_east.svg?component'
import IconSwap from '@/assets/icons/swap.svg?component'
import IconCircle from '@/assets/icons/cloud_circle.svg?component'

const props = defineProps({ wallet: Object })
const actions = [
	{ name: 'Send', icon: IconNorthEast, text: 'Send' },
	{ name: 'TxList', icon: IconSwap, text: 'Transactions' },
	// { name: 'Tokens', icon: IconCircle, text: 'Tokens' },
]
const verticalLayout = toRef(InterfaceStore.breakpoints, 'verticalLayout')
const route = useRoute()
const contentTransitionFactor = computed(() => route.meta.transition?.nameWallet || route.meta.transition?.nameLayout)
const contentTransitionAxis = computed(() => route.meta.transition?.nameWallet && verticalLayout.value ? 'x' : 'y' || 'y')
const contentKey = computed(() => route.path.split('/').join(''))
</script>



<style scoped>
.wallet {
	width: 100%;
}

.user-info {
	max-width: var(--column-width);
	padding: var(--spacing);
	padding-inline-end: 0;
}

.verticalContent .user-info {
	max-width: 100%;
	padding: var(--spacing);
}

.router-view {
	padding: var(--spacing);
	max-width: var(--column-large-width);
}

.verticalContent .router-view {
	max-width: 100%;
}

.actions {
	display: flex;
	flex-direction: column;
}

.action {
	padding: var(--spacing);
	border-radius: var(--border-radius);
}
</style>