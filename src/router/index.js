import { createRouter, createWebHashHistory } from 'vue-router'
import { ArweaveStore } from '@/store/ArweaveStore'
import Wallet from '../views/Wallet.vue'
import EditWallet from '../views/EditWallet.vue'
import TxList from '../views/TxList.vue'

const routes = [
	{
		path: '/',
		component: Wallet,
		children: [
			{
				name: 'Wallet',
				path: '',
				component: TxList,
				props: (route) => {
					return { wallet: route.query.wallet || 0 }
				},
			}
		],
		beforeEnter: (to, from, next) => {
			if (ArweaveStore.wallets.length == 0) {
				next(false)
			} else {
				next()
			}
		},
	},
	{
		path: '/edit',
		name: 'EditWallet',
		component: EditWallet,
	},
	{
		path: '/settings',
		name: 'Settings',
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import(/* webpackChunkName: "about" */ '../views/Settings.vue')
	}
]

const router = createRouter({
	history: createWebHashHistory(),
	routes
})

export default router
