<template>
	<div class="app" :class="{ verticalLayout, verticalContent }">
		<Toolbar class="toolbar" @drop.prevent="droppedFiles" />
		<router-view class="router" v-slot="{ Component, route }" @drop.prevent="droppedFiles">
			<transition :name="route.meta.mainTransitionName || 'slide-up'" mode="out-in" @before-enter="emitter.emit('beforeEnter')" @after-enter="emitter.emit('afterEnter')" @before-leave="emitter.emit('beforeLeave')" @after-leave="emitter.emit('afterLeave')">
				<component :is="Component" :key="$route.path.split('/').slice(0,3).join('')" />
			</transition>
		</router-view>
		<transition name="fade">
			<div v-if="dragOverlay" class="overlay" />
		</transition>
	</div>
</template>



<script>
import Toolbar from '@/components/Toolbar'
import ArweaveStore from './store/ArweaveStore'
import InterfaceStore, { emitter } from '@/store/InterfaceStore'
import { addWallet } from '@/functions/Wallets.js'
import { useRouter } from 'vue-router'
import { computed } from 'vue'

export default {
	components: {
		Toolbar
	},
	setup () {
		const verticalLayout = computed(() => InterfaceStore.breakpoints.verticalLayout)
		const verticalContent = computed(() => InterfaceStore.breakpoints.verticalContent)
		const dragOverlay = computed(() => InterfaceStore.dragOverlay)
		const router = useRouter()
		router.afterEach((to, from) => {
			document.title = to.meta.title || 'Arweave Wallet'
			const routes = router.options.routes
			let toIndex = routes.findIndex(el => el.path === to.path)
			let fromIndex = routes.findIndex(el => el.path === from.path)
			if (toIndex === fromIndex && to.params.walletId && from.params.walletId) {
				toIndex = ArweaveStore.wallets.findIndex(el => el.id == to.params.walletId)
				fromIndex = ArweaveStore.wallets.findIndex(el => el.id == from.params.walletId)
			}
			console.log(`from ${fromIndex} to ${toIndex}`) // to be fixed
			to.meta.mainTransitionName =
				verticalLayout.value
					? toIndex < fromIndex ? 'slide-right' : 'slide-left'
					: toIndex < fromIndex ? 'slide-down' : 'slide-up'
		})

		document.addEventListener('swUpdated', () => updateAvailable(), { once: true })
		if (navigator.serviceWorker) {
			navigator.serviceWorker.addEventListener('controllerchange', () => {
				if (window.swRefreshing) { return }
				window.swRefreshing = true
				window.location.reload()
			})
		}
		const updateAvailable = () => {
			if (window.confirm('Click ok to update the app')) { refreshApp() }
		}
		const refreshApp = () => {
			window.swRegistration?.waiting?.postMessage({ type: 'SKIP_WAITING' })
		}

		return { verticalLayout, verticalContent, dragOverlay, emitter }
	},
	methods: {
		async droppedFiles (e) {
			const walletPromises = []
			for (const file of e.dataTransfer.files) {
				const walletPromise = addWallet(JSON.parse(await file.text()))
				walletPromises.push(walletPromise)
			}
			const ids = (await Promise.all(walletPromises)).filter(e => e !== null).map(e => e.id)
			if (ids.length > 0) {
				this.$router.push({ name: 'EditWallet', query: { wallet: ids } })
			}
		}
	},
}
</script>



<style scoped>
.app {
	min-height: 100vh;
	overflow: hidden;
	display: flex;
}

.app.verticalLayout {
	flex-direction: column;
}

.toolbar {
	flex: 0 0 auto;
	display: flex;
	flex-direction: column;
	box-shadow: 0 0 0 0.5px var(--border);
	overflow: auto;
	overflow: overlay;
	z-index: 10;
	background: var(--background);
	height: 100%;
	width: auto;
	scrollbar-width: none;
	position: fixed;
}

.toolbar::-webkit-scrollbar {
	display: none;
}

.verticalLayout .toolbar {
	height: auto;
	width: 100%;
	flex-direction: row;
}

.router {
	min-width: 0;
	position: relative;
	margin-inline-start: 80px;
	min-height: 100vh;
	/* transform: translateZ(0); */
}

.verticalLayout .router {
	margin-top: 80px;
	margin-inline-start: 0;
	min-height: calc(100vh - 80px);
}

.overlay {
	pointer-events: none;
	position: fixed;
	width: 100%;
	height: 100%;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 1;
	background: #00000066;
}
</style>