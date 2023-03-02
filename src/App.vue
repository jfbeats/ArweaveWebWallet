<template>
	<div class="app" :class="{ verticalLayout, verticalContent, hasToolbar }">
		<Toolbar v-if="hasToolbar" class="box no-scrollbar" />
		<router-view v-slot="{ Component }">
			<div class="router">
				<TransitionsManager :vector="$route.meta.transition?.nameLayout" :axis="verticalLayout ? 'x' : 'y'">
					<component :is="Component" />
				</TransitionsManager>
				<UpdateAvailable />
			</div>
		</router-view>
		<transition name="fade">
			<div v-if="dragOverlay" class="overlay" />
		</transition>
		<Export />
		<Relay />
		<Password />
		<ScannerViewport />
		<div id="viewport" />
	</div>
</template>



<script setup lang="ts">
import Toolbar from '@/components/composed/Toolbar.vue'
import UpdateAvailable from '@/components/function/UpdateAvailable.vue'
import TransitionsManager from '@/components/visual/TransitionsManager.vue'
import Export from '@/components/function/Export.vue'
import Relay from '@/components/function/Relay.vue'
import Password from '@/components/function/Password.vue'
import ScannerViewport from '@/components/function/ScannerViewport.vue'
import { Wallets } from '@/functions/Wallets'
import InterfaceStore from '@/store/InterfaceStore'
import { findRoutePosition } from '@/router/Utils'
import { useRouter } from '@/router'
import { toRef } from 'vue'

const router = useRouter()

const verticalLayout = toRef(InterfaceStore.breakpoints, 'verticalLayout')
const verticalContent = toRef(InterfaceStore.breakpoints, 'verticalContent')
const dragOverlay = toRef(InterfaceStore, 'dragOverlay')
const hasToolbar = toRef(InterfaceStore.toolbar, 'enabled')
router.afterEach((to, from) => {
	document.title = to.meta.title ? to.meta.title + ' | Arweave Wallet' : 'Arweave Wallet'
	const routes = router.options.routes
	const param = {
		to: findRoutePosition(to.name, routes),
		from: findRoutePosition(from.name, routes)
	}
	to.meta.transition = { param, nameLayout: (param.to?.position || 0) - (param.from?.position || 0) }
	if (to.params.walletId && from.params.walletId && to.params.walletId !== from.params.walletId) {
		const toWallet = Wallets.value.findIndex(el => el.id == to.params.walletId)
		const fromWallet = Wallets.value.findIndex(el => el.id == from.params.walletId)
		to.meta.transition.nameWallet = toWallet - fromWallet
	}
})
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
	inset: 0;
	width: 100vw;
	height: 100%;
	z-index: -10;
	/* noinspection CssUnknownTarget */
	background: url("@/assets/background.svg") no-repeat center center;
	background-size: cover;
}

.toolbar {
	flex: 0 0 auto;
	display: flex;
	flex-direction: column;
	overflow: auto;
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
	overflow: clip;
}

#viewport {
	position: fixed;
	top: 0;
	z-index: 100;
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
	touch-action: none;
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