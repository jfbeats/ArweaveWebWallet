<template>
	<div class="wallet">
		<FoldingLayout v-if="wallet">
			<template #left>
				<transition :name="$route.meta.transition?.nameWallet" mode="out-in">
					<div class="user-info flex-column" :key="wallet.key">
						<Balance :wallet="wallet" />
						<div class="actions">
							<Action v-for="action in actions" :key="action.name" :to="{ name: action.name, query: { ...$route.query } }" :img="action.img" replace>{{ action.text }}</Action>
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



<script>
import FoldingLayout from '@/components/layout/FoldingLayout.vue'
import Balance from '@/components/composed/Balance.vue'
import Action from '@/components/atomic/Action.vue'
import ArweaveStore, { setCurrentWallet } from '@/store/ArweaveStore'
import { emitter } from '@/store/InterfaceStore'

import iconNorthEast from '@/assets/icons/north_east.svg'
import iconSwap from '@/assets/icons/swap.svg'
import iconCircle from '@/assets/icons/cloud_circle.svg'

export default {
	name: 'Wallet',
	components: { Balance, Action, FoldingLayout },
	props: ['wallet'],
	setup () {
		const actions = [
			{ name: 'Send', img: iconNorthEast, text: 'Send' },
			{ name: 'TxList', img: iconSwap, text: 'Transactions' },
			// { name: 'Tokens', img: iconCircle, text: 'Tokens' },
		]
		return { actions, emitter }
	},
	watch: {
		wallet: {
			handler: function (wallet) {
				if (!wallet) { setCurrentWallet(ArweaveStore.wallets[0]) }
				else { setCurrentWallet(wallet) }
			},
			immediate: true
		},
	},
}
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