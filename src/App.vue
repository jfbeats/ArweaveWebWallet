<template>
	<div class="app" :class="{ verticalLayout }">
		<Toolbar class="toolbar" :class="{ verticalLayout, dragOverlay }" @drop.prevent="droppedFiles" />
		<router-view class="router" v-slot="{ Component, route }" @drop.prevent="droppedFiles">
			<transition :name="route.meta.mainTransitionName || 'slide-up'" mode="out-in" @before-enter="emitter.emit('beforeEnter')" @after-enter="emitter.emit('afterEnter')" @before-leave="emitter.emit('beforeLeave')" @after-leave="emitter.emit('afterLeave')">
				<component :is="Component" :key="$route.path.split('/').slice(0,3).join('')" />
			</transition>
		</router-view>
	</div>
</template>



<script>
import Toolbar from '@/components/Toolbar'
import ArweaveStore from './store/ArweaveStore'
import InterfaceStore, { emitter } from '@/store/InterfaceStore'
import { newWallet } from '@/functions/Wallets.js'
import { useRouter } from 'vue-router'
import { computed, ref } from 'vue'

export default {
	components: {
		Toolbar
	},
	setup () {
		const verticalLayout = computed(() => InterfaceStore.breakpoints.verticalLayout)
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
		return { verticalLayout, dragOverlay, emitter }
	},
	methods: {
		async droppedFiles (e) {
			const walletPromises = []
			for (const file of e.dataTransfer.files) {
				const walletPromise = newWallet(JSON.parse(await file.text()))
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
	outline: 1px solid var(--border);
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

.toolbar.verticalLayout {
	height: auto;
	width: 100%;
	flex-direction: row;
}

.router {
	min-width: 0;
	position: relative;
	margin-left: 80px;
	min-height: 100vh;
	/* transform: translateZ(0); */
}

.verticalLayout .router {
	margin-top: 80px;
	margin-left: 0;
	min-height: calc(100vh - 80px);
}

.dragOverlay::before {
	content: "";
	background-image: radial-gradient(circle at center, #333, #111);
	background-position: center;
	background-repeat: no-repeat;
	background-origin: center;
	background-size: cover;
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 99999;
	opacity: 0.5;
}

.dragOverlay::after {
	text-align: center;
	content: "";
	background-image: url("~@/assets/icons/drop.svg");
	background-position: center;
	background-repeat: no-repeat;
	background-origin: center;
	background-size: 48px 48px;
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 0 16px;
	padding-top: 200px;
	z-index: 99999;
	opacity: 0.5;
}
</style>