import { createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw, useRoute as useRouteLib, useRouter as useRouterLib } from 'vue-router'
import { getWalletById, Wallets } from '@/functions/Wallets'
import { emitter } from '@/store/InterfaceStore'
import { state } from '@/functions/Channels'
import { getBaseUrl } from '@/router/Utils'
import { asyncRoute } from '@/router/routing'
import type { ExtractNames } from '@/router/types'
import Wallet from '@/views/Wallet.vue'
import TxList from '@/views/TxList.vue'
import Send from '@/views/Send.vue'
import Tokens from '@/views/Tokens.vue'
import AddWallet from '@/views/AddWallet.vue'
import EditWallet from '@/views/EditWallet.vue'
import Settings from '@/views/Settings.vue'
import Cold from '@/views/Cold.vue'
import Connect from '@/views/Connect.vue'

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
				props: (route) => ({ wallet: getWalletById(route.params.walletId) }),
			},
			{
				name: 'TxList',
				path: 'tx-list/:queryName?',
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
		component: Connect,
		meta: { title: 'Connect' }
	},
	{
		path: '/explore',
		name: 'Explore',
		component: () => import('@/views/Explore.vue'),
		meta: {},
	},
	{
		path: '/add',
		name: 'AddWallet',
		component: AddWallet,
		meta: { title: 'Add Wallets' }
	},
	{
		path: '/edit',
		name: 'EditWallet',
		component: EditWallet,
		meta: { title: 'Edit Wallets' },
	},
	{
		path: '/settings',
		name: 'Settings',
		component: Settings,
		meta: { title: 'Settings' },
	},
	{
		path: '/cold',
		name: 'Cold',
		component: Cold,
		meta: { title: 'Permafrost Vault' },
	},
	{
		path: '/wordlist',
		name: 'WordList',
		component: () => import('@/views/WordList.vue'),
		meta: { title: 'Word List' },
	},
	{
		path: '/connector',
		name: 'Connector',
		component: () => import('@/views/Connector.vue'),
	},
	{
		path: '/:pathMatch(.*)*',
		redirect: to => {
			asyncRoute(to.path)
			if (state.value.type !== 'client') { return { name: 'Connect' } }
			state.value.redirect = true
			return Wallets.value[0]
				? { name: 'TxList', params: { walletId: Wallets.value[0].id } }
				: { name: 'Welcome' }
		}
	},
] as const satisfies AsConst<RouteRecordRaw[]>
export type AllRouteNames = ExtractNames<typeof routes>

const router = createRouter({
	history: getBaseUrl() === '/' ? createWebHistory() : createWebHashHistory(),
	routes: routes as any,
	scrollBehavior: (to, from, savedPosition) => new Promise((resolve) => {
		// todo https://github.com/vuejs/vue-router/issues/1620
		if (to.params.walletId && from.params.walletId && to.params.walletId === from.params.walletId) { resolve() }
		const position = savedPosition || { top: 0 }
		emitter.once('scrollHistory', () => resolve(position))
	})
}) as Router

export const useRouter = useRouterLib as () => Router
export const useRoute = useRouteLib

export default router