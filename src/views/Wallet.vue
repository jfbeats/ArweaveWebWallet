<template>
	<div class="wallet">
		<div v-if="wallet" class="content" :class="{ verticalContent }">
			<div class="wallet-info">
				<Balance :wallet="wallet" />
				<div class="actions">
					<Action v-for="action in actions" :key="action.name" :to="{name: action.name, query: {...$route.query}}" :img="action.img">{{ action.text }}</Action>
				</div>
			</div>
			<div class="wallet-view">
				<router-view v-slot="{ Component, route }" class="router-view">
					<transition :name="route.meta.subTransitionName" mode="out-in">
						<component :is="Component" />
					</transition>
				</router-view>
			</div>
		</div>
	</div>
</template>



<script>
import Balance from '@/components/Balance'
import Action from '@/components/atomic/Action'
import ArweaveStore, { setCurrentWallet } from '@/store/ArweaveStore'
import InterfaceStore from '@/store/InterfaceStore'
import { useRouter } from 'vue-router'
import { computed } from 'vue'

export default {
	name: 'Wallet',
	components: { Balance, Action },
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
.content {
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: flex-start;
	overflow: hidden;
}

.content.verticalContent {
	display: block;
	overflow-y: auto;
}

.wallet-info {
	flex: 1 1 auto;
	min-width: 0;
	max-width: 700px;
	padding: var(--spacing) 0 var(--spacing) var(--spacing);
}

.wallet-view {
	height: 100%;
	flex: 2 1 500px;
	min-width: 0;
	overflow-y: auto;
	padding: var(--spacing);
}

.router-view {
	max-width: 1000px;
}

.verticalContent .wallet-view {
	height: auto;
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