import { createRouter, createWebHashHistory } from 'vue-router'
import ArweaveStore , { getWalletById } from '@/store/ArweaveStore'
import Wallet from '@/views/Wallet.vue'
import TxList from '@/views/TxList.vue'
import Send from '@/views/Send.vue'
import Tokens from '@/views/Tokens.vue'

const routes = [
	{
		name: 'Wallet',
		path: '/wallet/:walletId(\\d+)',
		component: Wallet,
		props: (route) => { return { wallet: getWalletById(route.params.walletId) } },
		children: [
			{
				name: 'TxList',
				path: 'tx-list',
				component: TxList,
				props: (route) => { return { wallet: getWalletById(route.params.walletId) } },
				meta: { title: 'Wallet Transactions' },
			},
			{
				name: 'Send',
				path: 'send',
				component: Send,
				meta: { title: 'Wallet Send' },
			},
			{
				name: 'Tokens',
				path: 'tokens',
				component: Tokens,
				meta: { title: 'Wallet Tokens' },
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
		name: 'Tx',
		path: '/tx/:txId',
		component: () => import('@/views/Tx.vue'),
		props: true,
		meta: { title: 'Arweave Transaction' },
	},
	{
		name: 'Profile',
		path: '/profile/:key',
		component: () => import('@/views/Profile.vue'),
		props: true,
		meta: { title: 'Arweave Profile' },
	},
	{
		path: '/edit',
		name: 'EditWallet',
		component: () => import('@/views/EditWallet.vue'),
		meta: { title: 'Edit Wallets' },
	},
	{
		path: '/settings',
		name: 'Settings',
		component: () => import('@/views/Settings.vue'),
		meta: { title: 'Settings' },
	},
	{
		path: '/welcome',
		name: 'Welcome',
		component: () => import('@/views/Welcome.vue'),
		meta: { title: 'Welcome to the weave' },
	},
	{
		path: '/:pathMatch(.*)*',
		redirect: { name: 'TxList', params: { walletId: ArweaveStore.wallets[0].id } }
	},
]

const router = createRouter({
	history: createWebHashHistory(),
	routes,
})

export default router
