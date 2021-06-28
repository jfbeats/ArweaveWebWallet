<template>
	<FoldingLayout v-if="wallet" :class="{ verticalContent }">
		<template #left>
			<div class="wallet-info">
				<Balance :wallet="wallet" />
				<div class="actions">
					<Action v-for="action in actions" :key="action.name" :to="{name: action.name, query: {...$route.query}}" :img="action.img">{{ action.text }}</Action>
				</div>
			</div>
		</template>
		<template #right>
			<div class="wallet-view">
				<router-view v-slot="{ Component, route }" class="router-view">
					<transition :name="route.meta.subTransitionName" mode="out-in">
						<component :is="Component" />
					</transition>
				</router-view>
			</div>
		</template>
	</FoldingLayout>
</template>



<script>
import FoldingLayout from '@/components/FoldingLayout.vue'
import Balance from '@/components/Balance'
import Action from '@/components/atomic/Action'
import ArweaveStore, { setCurrentWallet } from '@/store/ArweaveStore'
import InterfaceStore from '@/store/InterfaceStore'
import { useRouter } from 'vue-router'
import { computed } from 'vue'

export default {
	name: 'Wallet',
	components: { Balance, Action, FoldingLayout },
	props: ['wallet'],
	setup () {
		const actions = [
			{ name: 'Send', img: require('@/assets/icons/north_east.svg'), text: 'Send' },
			{ name: 'TxList', img: require('@/assets/icons/swap.svg'), text: 'Transactions' },
			{ name: 'Tokens', img: require('@/assets/icons/cloud_circle.svg'), text: 'Tokens' },
		]
		const router = useRouter()
		router.afterEach((to, from) => {
			const toIndex = actions.findIndex(el => el.name === to.name)
			const fromIndex = actions.findIndex(el => el.name === from.name)
			to.meta.subTransitionName = toIndex < fromIndex ? 'slide-down' : 'slide-up'
		})
		const verticalContent = computed(() => InterfaceStore.breakpoints.verticalContent)
		return { actions, verticalContent }
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
.wallet-info {
	max-width: 700px;
	padding: var(--spacing) 0 var(--spacing) var(--spacing);
}

.verticalContent .wallet-info {
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

.action:hover {
	background: #00000022;
}
</style>