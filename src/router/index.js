import { createRouter, createWebHashHistory } from 'vue-router'
import { ArweaveStore } from '@/store/ArweaveStore'
import Wallet from '../views/Wallet.vue'
import EditWallet from '../views/EditWallet.vue'

const routes = [
	{
		path: '/',
		name: 'Wallet',
		component: Wallet,
		beforeEnter: (to, from, next) => {
			if (ArweaveStore.wallets.length == 0) {
				next(false)
			} else if (!ArweaveStore.getWalletById(to.query.wallet)) {
				console.log('returning to first wallet')
				next({ query: { wallet: ArweaveStore.wallets[0].id } })
			} else {
				next()
			}
		}
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
