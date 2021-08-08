<template>
	<div class="wallet">
		<FoldingLayout v-if="wallet">
			<template #left>
				<div class="wallet-info">
					<transition :name="$route.meta.transition?.nameWallet" mode="out-in">
						<div :key="wallet.key">
							<Balance :wallet="wallet" />
							<div class="actions">
								<Action v-for="action in actions" :key="action.name" :to="{name: action.name, query: {...$route.query}}" :img="action.img" replace>{{ action.text }}</Action>
							</div>
						</div>
					</transition>
				</div>
			</template>
			<template #right>
				<div class="wallet-view">
					<router-view v-slot="{ Component }" class="router-view" @before-enter="emitter.emit('beforeEnter')">
						<transition :name="$route.meta.transition?.nameWallet || $route.meta.transition?.name" mode="out-in">
							<component :is="Component" :key="$route.path.split('/').slice(0,3).join('')" />
						</transition>
					</router-view>
				</div>
			</template>
		</FoldingLayout>
	</div>
</template>



<script>
import FoldingLayout from '@/components/FoldingLayout.vue'
import Balance from '@/components/Balance'
import Action from '@/components/atomic/Action'
import ArweaveStore, { setCurrentWallet } from '@/store/ArweaveStore'

export default {
	name: 'Wallet',
	components: { Balance, Action, FoldingLayout },
	props: ['wallet'],
	setup () {
		const actions = [
			{ name: 'Send', img: require('@/assets/icons/north_east.svg'), text: 'Send' },
			{ name: 'TxList', img: require('@/assets/icons/swap.svg'), text: 'Transactions' },
			// { name: 'Tokens', img: require('@/assets/icons/cloud_circle.svg'), text: 'Tokens' },
		]
		return { actions }
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

.wallet-info {
	max-width: 700px;
	padding: var(--spacing);
	padding-inline-end: 0;
}

.verticalContent .wallet-info {
	max-width: 100%;
	padding: var(--spacing);
}

.wallet-view {
	padding: var(--spacing);
}

.router-view {
	max-width: 1000px;
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