<template>
	<div class="wallet">
		<FoldingLayout v-if="wallet">
			<template #left>
				<transition :name="$route.meta.transition?.nameWallet" mode="out-in">
					<div class="user-info flex-column" :key="wallet.key">
						<Balance :wallet="wallet" />
						<div class="actions">
							<Action v-for="action in actions" :key="action.name" :to="{ name: action.name, query: { ...$route.query } }" :icon="action.icon" replace>{{ action.text }}</Action>
						</div>
					</div>
				</transition>
			</template>
			<template #right>
				<div class="wallet-view">
					<router-view v-slot="{ Component }" class="router-view" @before-enter="emitter.emit('beforeEnter')">
						<transition :name="$route.meta.transition?.nameWallet || $route.meta.transition?.name" mode="out-in" @before-enter="emitter.emit('beforeEnter')" @after-enter="emitter.emit('afterEnter')" @before-leave="emitter.emit('beforeLeave')" @after-leave="emitter.emit('afterLeave')">
							<component :is="Component" :key="$route.path.split('/').slice(0, 3).join('')" />
						</transition>
					</router-view>
				</div>
			</template>
		</FoldingLayout>
	</div>
</template>



<script setup>
import FoldingLayout from '@/components/layout/FoldingLayout.vue'
import Balance from '@/components/composed/Balance.vue'
import Action from '@/components/atomic/Action.vue'
import { Wallets } from '@/functions/Wallets'
import { emitter } from '@/store/InterfaceStore'
import { watch } from 'vue'

import IconNorthEast from '@/assets/icons/north_east.svg?component'
import IconSwap from '@/assets/icons/swap.svg?component'
import IconCircle from '@/assets/icons/cloud_circle.svg?component'

const props = defineProps({ wallet: Object })
const actions = [
	{ name: 'Send', icon: IconNorthEast, text: 'Send' },
	{ name: 'TxList', icon: IconSwap, text: 'Transactions' },
	// { name: 'Tokens', icon: IconCircle, text: 'Tokens' },
]
watch(() => props.wallet, (wallet) => wallet.updateBalance?.(), { immediate: true }) // update balance instead
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

.wallet-view {
	padding: var(--spacing);
}

.router-view {
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