import { createRouter, createWebHistory, createWebHashHistory, START_LOCATION } from 'vue-router'
import { loadDemo } from '@/store/ArweaveStore'
import { Wallets, getWalletById } from '@/functions/Wallets'
// import arwallet class
import InterfaceStore, { emitter } from '@/store/InterfaceStore'
import { state } from '@/functions/Connect'
import Wallet from '@/views/Wallet.vue'
import TxList from '@/views/TxList.vue'
import Send from '@/views/Send.vue'
import Tokens from '@/views/Tokens.vue'

const routes = [
	{
		name: 'Wallet',
		path: '/wallet/:walletId(\\d+)',
		component: Wallet,
		props: (route) => ({ wallet: getWalletById(route.params.walletId) }),
		beforeEnter: (to) => {
			if (!Wallets.value[0]) { return { name: 'Welcome' } }
			if (!to.params.walletId || !getWalletById(to.params.walletId)) {
				return { name: 'TxList', params: { walletId: Wallets.value[0].id } }
			}
		},
		children: [
			{
				name: 'Send',
				path: 'send',
				component: Send,
				meta: { title: 'Send' },
				props: (route) => ({
					wallet: getWalletById(route.params.walletId),
					model: InterfaceStore.wallet.send
				}),
			},
			{
				name: 'TxList',
				path: 'tx-list',
				component: TxList,
				meta: { title: 'Transactions' },
				props: (route) => ({ wallet: getWalletById(route.params.walletId) }),
			},
			{
				name: 'Tokens',
				path: 'tokens',
				component: Tokens,
				meta: { title: 'Tokens' },
				props: (route) => ({ wallet: getWalletById(route.params.walletId) }),
			},
		],
	},
	{
		name: 'Tx',
		path: '/tx/:txId',
		component: () => import('@/views/Tx.vue'),
		meta: { title: 'Transaction' },
		props: true,
	},
	{
		name: 'Profile',
		path: '/profile/:key',
		component: () => import('@/views/Profile.vue'),
		meta: { title: 'Profile' },
		props: true,
	},
	{
		path: '/welcome',
		name: 'Welcome',
		component: () => import('@/views/Welcome.vue'),
		meta: {},
	},
	{
		path: '/connect',
		name: 'Connect',
		component: () => import('@/views/Connect.vue'),
		meta: { title: 'Connect' }
	},
	{
		path: '/add',
		name: 'AddWallet',
		component: () => import('@/views/AddWallet.vue'),
		meta: { title: 'Add Wallets' }
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
		path: '/demo',
		redirect: () => {
			loadDemo()
			return { name: 'Welcome' }
		}
	},
	{
		path: '/connector',
		name: 'Connector',
		component: () => import('@/views/Connector.vue'),
	},
	{
		path: '/:pathMatch(.*)*',
		redirect: () => {
			if (state.type === 'iframe') { InterfaceStore.toolbar.enabled = false; return { name: 'Connector' } }
			if (state.type === 'popup') { return { name: 'Connect' } }
			return Wallets.value[0]
				? { name: 'TxList', params: { walletId: Wallets.value[0].id } }
				: { name: 'Welcome' }
		}
	},
]

const router = createRouter({
	history: import.meta.env.BASE_URL === '/' ? createWebHistory() : createWebHashHistory(),
	routes,
	scrollBehavior: (to, from, savedPosition) => new Promise((resolve) => {
		const position = savedPosition || { top: 0 }
		emitter.once('beforeEnter', () => resolve(position))
	})
})

export default router
