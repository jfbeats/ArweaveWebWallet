<template>
	<div class="app" :class="{ verticalLayout, verticalContent, hasToolbar }">
		<Toolbar v-if="hasToolbar" class="box no-scrollbar" @drop.prevent="droppedFiles" />
		<router-view v-slot="{ Component }" @drop.prevent="droppedFiles">
			<div class="router" :class="{ sticky }">
				<transition :name="$route.meta.transition?.nameLayout" mode="out-in" @before-enter="emitter.emit('beforeEnter')" @after-enter="emitter.emit('afterEnter')" @before-leave="emitter.emit('beforeLeave')" @after-leave="emitter.emit('afterLeave')">
					<component :is="Component" />
				</transition>
				<UpdateAvailable />
			</div>
		</router-view>
		<transition name="fade">
			<div v-if="dragOverlay" class="overlay" />
		</transition>
		<div id="viewport" />
	</div>
</template>



<script setup>
import Toolbar from '@/components/composed/Toolbar.vue'
import UpdateAvailable from '@/components/function/UpdateAvailable.vue'
import { Wallets } from '@/functions/Wallets'
import InterfaceStore, { emitter } from '@/store/InterfaceStore'
import { addWallet } from '@/functions/Wallets'
import { useRoute, useRouter } from 'vue-router'
import { ref, toRef } from 'vue'

const router = useRouter()
const route = useRoute()

const verticalLayout = toRef(InterfaceStore.breakpoints, 'verticalLayout')
const verticalContent = toRef(InterfaceStore.breakpoints, 'verticalContent')
const sticky = ref(false)
emitter.on('beforeEnter', () => sticky.value = InterfaceStore.sticky)
emitter.on('afterLeave', () => sticky.value = InterfaceStore.sticky)
const dragOverlay = toRef(InterfaceStore, 'dragOverlay')
const hasToolbar = toRef(InterfaceStore.toolbar, 'enabled')
router.afterEach((to, from) => {
	document.title = to.meta.title ? to.meta.title + ' | Arweave Wallet' : 'Arweave Wallet'
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
	to.meta.transition = {}
	to.meta.transition.param = param
	to.meta.transition.name = param.to.position < param.from.position ? 'slide-down' : 'slide-up'
	to.meta.transition.nameLayout = convertTransitionName(to.meta.transition.name)
	if (to.params.walletId && from.params.walletId && to.params.walletId !== from.params.walletId) {
		const toWallet = Wallets.value.findIndex(el => el.id == to.params.walletId)
		const fromWallet = Wallets.value.findIndex(el => el.id == from.params.walletId)
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

const droppedFiles = async (e) => {
	const walletPromises = []
	for (const file of e.dataTransfer.files) {
		const walletPromise = addWallet(JSON.parse(await file.text()))
		walletPromises.push(walletPromise)
	}
	const ids = (await Promise.all(walletPromises)).filter(e => e !== null).map(e => e.id)
	if (ids.length > 0) {
		router.push({ name: 'EditWallet', query: { wallet: ids } })
	}
}
</script>



<style scoped>
.app {
	display: flex;
}

.app:before {
	overflow: hidden;
	content: "";
	display: block;
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	width: 100vw;
	height: 100%;
	z-index: -10;
	background: url("@/assets/background.svg") no-repeat center center;
	background-size: cover;
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
	width: var(--toolbar-size);
	position: fixed;
}

.verticalLayout .toolbar {
	height: var(--toolbar-size);
	width: 100%;
	flex-direction: row;
}

.router {
	position: relative;
	--current-vh: 100vh;
	--current-vw: 100vw;
	overflow: hidden;
}

.router.sticky {
	overflow: unset;
}

#viewport {
	position: fixed;
	top: 0;
}

.router,
#viewport {
	width: 100%;
	min-width: 0;
}

.hasToolbar .router,
.hasToolbar #viewport {
	padding-inline-start: var(--toolbar-size);
}

.hasToolbar:not(.verticalLayout) .router,

.hasToolbar:not(.verticalLayout) #viewport {
	--current-vw: calc(100vw - var(--toolbar-size));

}

.hasToolbar.verticalLayout .router,
.hasToolbar.verticalLayout #viewport {
	--current-vh: calc(100vh - var(--toolbar-size));
	padding-inline-start: 0;
	padding-top: var(--toolbar-size);
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