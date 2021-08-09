<template>
	<div class="app" :class="{ verticalLayout, verticalContent }">
		<Toolbar class="toolbar" @drop.prevent="droppedFiles" />
		<router-view v-slot="{ Component }" @drop.prevent="droppedFiles">
			<div class="router">
				<transition :name="$route.meta.transition?.nameLayout" mode="out-in" @before-enter="emitter.emit('beforeEnter')" @after-enter="emitter.emit('afterEnter')" @before-leave="emitter.emit('beforeLeave')" @after-leave="emitter.emit('afterLeave')">
					<component :is="Component" />
				</transition>
			</div>
		</router-view>
		<transition name="fade">
			<div v-if="dragOverlay" class="overlay" />
		</transition>
		<div id="viewport" />
	</div>
</template>



<script>
import Toolbar from '@/components/Toolbar'
import ArweaveStore from './store/ArweaveStore'
import InterfaceStore, { emitter } from '@/store/InterfaceStore'
import { addWallet } from '@/functions/Wallets.js'
import { useRoute, useRouter } from 'vue-router'
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
		const route = useRoute()
		router.afterEach((to, from) => {
			document.title = to.meta.title || 'Arweave Wallet'
			const routes = router.options.routes
			const findRecursiveHelper = (name, arr) => {
				const result = findRecursive(name, arr)
				return result.found ? result : null
			}
			const findRecursive = (name, arr, position = 0, depth = 0) => {
				for (const route of arr) {
					if (route.name === name) { return { found: true, position, depth } }
					position++
					if (route.children) {
						const recResult = findRecursive(name, route.children, position, depth + 1)
						position += recResult.position
						if (recResult.found) { return { found: true, position, depth: recResult.depth } }
					}
				}
				return { found: false, position, depth }
			}
			const param = {
				to: findRecursiveHelper(to.name, routes),
				from: findRecursiveHelper(from.name, routes)
			}
			console.log(param)
			to.meta.transition = {}
			to.meta.transition.param = param
			to.meta.transition.name = param.to.position < param.from.position ? 'slide-down' : 'slide-up'
			to.meta.transition.nameLayout = convertTransitionName(to.meta.transition.name)
			if (param.to.position === param.from.position && to.params.walletId !== from.params.walletId) {
				const toWallet = ArweaveStore.wallets.findIndex(el => el.id == to.params.walletId)
				const fromWallet = ArweaveStore.wallets.findIndex(el => el.id == from.params.walletId)
				const transition = toWallet < fromWallet ? 'slide-down' : 'slide-up'
				to.meta.transition.nameWallet = convertTransitionName(transition)
			}
		})

		const convertTransitionName = (name) => {
			if (verticalLayout.value) {
				if (name === 'slide-down') { return 'slide-right' }
				if (name === 'slide-up') { return 'slide-left' }
			}
			return name
		}

		emitter.on('afterEnter', () => route.meta.transition = {})

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

.toolbar {
	flex: 0 0 auto;
	display: flex;
	flex-direction: column;
	overflow: auto;
	overflow: overlay;
	z-index: 10;
	background: var(--background);
	height: 100%;
	width: auto;
	scrollbar-width: none;
	position: fixed;
	outline: 0.5px solid var(--border);
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
	position: relative;
}

#viewport {
	position: fixed;
	top: 0;
}

.router,
#viewport {
	padding-inline-start: 80px;
	width: 100%;
	min-width: 0;
	min-height: 100vh;
}

.verticalLayout .router,
.verticalLayout #viewport {
	padding-inline-start: 0;
	padding-top: 80px;
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