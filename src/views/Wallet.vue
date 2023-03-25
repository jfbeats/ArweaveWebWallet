<template>
	<div class="wallet">
		<router-view v-slot="{ Component }">
			<FoldingLayout v-if="wallet" :leftVector="$route.meta.transition?.nameWallet" :rightVector="contentTransitionFactor" :rightAxis="contentTransitionAxis">
				<template #left>
					<div class="user-info flex-column" :key="wallet.key">
						<Balance :wallet="wallet" />
						<div class="actions">
							<Selector selector=".action" active=".active, .router-link-active" :vertical="true">
								<Action v-for="action in actions" :key="action.name" :to="{ name: action.name }" :icon="action.icon" replace>{{ action.text }}</Action>
							</Selector>
						</div>
					</div>
				</template>
				<template #right>
					<div :key="$route.name?.toString() + $route.params.walletId.toString()" class="router-view">
						<component :is="Component" />
					</div>
				</template>
			</FoldingLayout>
		</router-view>
	</div>
</template>



<script setup lang="ts">
import FoldingLayout from '@/components/layout/FoldingLayout.vue'
import Balance from '@/components/composed/Balance.vue'
import Selector from '@/components/atomic/Selector.vue'
import Action from '@/components/atomic/Action.vue'
import InterfaceStore from '@/store/InterfaceStore'
import { toRef, computed } from 'vue'
import { useRoute } from '@/router'
import { ICON } from '@/store/Theme'

const props = defineProps<{ wallet: Wallet }>()

const actions = [
	{ name: 'Send', icon: ICON.northEast, text: 'Send' },
	// { name: 'Send', icon: IconSouthWest, text: 'Receive' },
	{ name: 'TxList', icon: ICON.swap, text: 'Transactions' },
	// { name: 'Tokens', icon: IconCircle, text: 'Tokens' },
]
const verticalLayout = toRef(InterfaceStore.breakpoints, 'verticalLayout')
const route = useRoute()
const contentTransitionFactor = computed(() => route.meta.transition?.nameWallet || route.meta.transition?.nameLayout)
const contentTransitionAxis = computed(() => route.meta.transition?.nameWallet && verticalLayout.value ? 'x' : 'y' || 'y')
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