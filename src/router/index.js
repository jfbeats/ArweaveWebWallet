import { createRouter, createWebHashHistory } from 'vue-router'
import ArweaveStore from '@/store/ArweaveStore'
import Wallet from '@/views/Wallet.vue'
import TxList from '@/views/TxList.vue'
import Send from '@/views/Send.vue'
import Tokens from '@/views/Tokens.vue'

const routes = [
	{
		name: 'Wallet',
		path: '/wallet/:walletId(\\d+)',
		component: Wallet,
		props: (route) => { return { wallet: ArweaveStore.getWalletById(route.params.walletId) } },
		children: [
			{
				name: 'Tx',
				path: 'tx',
				component: TxList,
				props: (route) => { return { wallet: ArweaveStore.getWalletById(route.params.walletId) } },
			},
			{
				name: 'Send',
				path: 'send',
				component: Send,
			},
			{
				name: 'Tokens',
				path: 'tokens',
				component: Tokens,
			},
		],
		beforeEnter: (to, from) => {
			if (ArweaveStore.wallets.length == 0) {
				return { name: 'Welcome' }
			} else if (!to.params.walletId) {
				return { name: 'Wallet', params: { walletId: ArweaveStore.wallets[0].id } }
			}
		},
	},
	{
		path: '/edit',
		name: 'EditWallet',
		component: () => import('@/views/EditWallet.vue'),
	},
	{
		path: '/settings',
		name: 'Settings',
		component: () => import('@/views/Settings.vue')
	},
	{
		path: '/welcome',
		name: 'Welcome',
		component: () => import('@/views/Welcome.vue')
	},
	{
		path: '/:pathMatch(.*)*',
		redirect: { name: 'Tx', params: { walletId: ArweaveStore.wallets[0].id } }
	},
]

const router = createRouter({
	history: createWebHashHistory(),
	routes
})

export default router