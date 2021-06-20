<template>
	<div v-if="wallet" class="wallet">
		<div class="wallet-info">
			<Balance :wallet="wallet" />
			<div class="actions">
				<Action v-for="action in actions" :key="action.name" :to="{name: action.name, query: {...$route.query}}" :img="action.img">{{ action.text }}</Action>
			</div>
		</div>
		<router-view class="wallet-view" v-slot="{ Component, route }">
			<transition :name="route.meta.subTransitionName" mode="out-in">
				<component :is="Component" />
			</transition>
		</router-view>
	</div>
</template>

<script>
import Balance from '@/components/Balance'
import Action from '@/components/atomic/Action'
import ArweaveStore from '@/store/ArweaveStore'
import { useRouter } from 'vue-router'

export default {
	name: 'Wallet',
	components: { Balance, Action },
	props: ['wallet'],
	setup () {
		const actions = [
			{ name: 'Send', img: require('@/assets/icons/north_east.svg'), text: 'Send' },
			{ name: 'Tx', img: require('@/assets/icons/swap.svg'), text: 'Transactions' },
			{ name: 'Tokens', img: require('@/assets/icons/cloud_circle.svg'), text: 'Tokens' },
		]
		const router = useRouter()
		router.afterEach((to, from) => {
			const toIndex = actions.findIndex(el => el.name === to.name)
			const fromIndex = actions.findIndex(el => el.name === from.name)
			to.meta.subTransitionName = toIndex < fromIndex ? 'slide-down' : 'slide-up'
		})
		return { ArweaveStore, actions }
	},
	watch: {
		wallet: {
			handler: function (wallet) {
				if (!wallet) { ArweaveStore.setCurrentWallet(ArweaveStore.wallets[0]) }
				else { ArweaveStore.setCurrentWallet(wallet) }
			},
			immediate: true
		},
	},
}
</script>

<style scoped>
.container {
	display: flex;
	justify-content: center;
}

.wallet {
	min-width: 400px;
	max-width: 1700px;
	display: flex;
	justify-content: center;
	align-items: flex-start;
	flex-wrap: wrap;
	gap: var(--spacing);
	padding: var(--spacing);
}

.wallet-info {
	flex: 1 1 400px;
	min-width: 0;
}

.wallet-view {
	flex: 1.5 1 500px;
	min-width: 0;
}

.actions {
	display: flex;
	flex-direction: column;
}

.action {
	padding: var(--spacing);
	border-radius: var(--border-radius);
	transition: 0.1s ease;
}

.action:hover {
	background: #00000022;
}
</style>