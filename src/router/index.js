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
				props: () => { return { wallet: ArweaveStore.currentWallet } },
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
		component: () => import('../views/Settings.vue')
	}
]

const router = createRouter({
	history: createWebHashHistory(),
	routes
})

export default router
