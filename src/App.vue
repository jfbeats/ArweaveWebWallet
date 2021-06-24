<template>
	<Toolbar class="toolbar" :class="{ verticalLayout }" @drop.prevent="droppedFiles" @dragover.prevent />
	<router-view class="router" @drop.prevent="droppedFiles" @dragover.prevent v-slot="{ Component, route }">
		<transition :name="route.meta.mainTransitionName" mode="out-in">
			<component :is="Component" :key="$route.path.split('/').slice(0,3).join('')" />
		</transition>
	</router-view>
</template>



<script>
import Toolbar from '@/components/Toolbar'
import ArweaveStore from './store/ArweaveStore'
import InterfaceStore from '@/store/InterfaceStore'
import { newWallet } from '@/functions/Wallets.js'
import { useRouter } from 'vue-router'
import { computed, ref } from '@vue/runtime-core'

export default {
	components: {
		Toolbar
	},
	setup () {
		const toolbar = ref(null)
		const verticalLayout = computed(() => InterfaceStore.breakpoints.verticalLayout)
		const router = useRouter()
		router.afterEach((to, from) => {
			const routes = router.options.routes
			let toIndex = routes.findIndex(el => el.path === to.path)
			let fromIndex = routes.findIndex(el => el.path === from.path)
			if (toIndex === fromIndex && to.params.walletId && from.params.walletId) {
				toIndex = ArweaveStore.wallets.findIndex(el => el.id == to.params.walletId)
				fromIndex = ArweaveStore.wallets.findIndex(el => el.id == from.params.walletId)
			}
			to.meta.mainTransitionName =
				verticalLayout.value
					? toIndex < fromIndex ? 'slide-right' : 'slide-left'
					: toIndex < fromIndex ? 'slide-down' : 'slide-up'
		})
		return { toolbar, verticalLayout }
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
	}
}
</script>



<style scoped>
.toolbar {
	flex: 0 0 auto;
	display: flex;
	flex-direction: column;
	outline: 1px solid var(--border);
	overflow: auto;
	overflow: overlay;
	z-index: 1;
	background: var(--background);
	height: 100%;
	width: auto;
	scrollbar-width: none;
}

.toolbar::-webkit-scrollbar {
	display: none;
}

.toolbar.verticalLayout {
	height: auto;
	width: 100%;
}

.toolbar.verticalLayout {
	flex-direction: row;
}


.router {
	width: 100%;
	height: 100%;
	overflow: auto;
}
</style>



<style>
html {
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	background: #0f0f0f;

	--spacing: 24px;
	--background: #151515;
	--background2: #181818;
	--background3: #262626;
	--border: #222;
	--border-radius: 8px;
	--border-radius2: 12px;
	--border-radius3: 12px;
	--element-secondary: #bbb;
	--element-secondary-opacity: 0.75;
	--element-disabled-opacity: 0.5;
}

body {
	width: 100%;
	height: 100%;
	margin: 0;
	padding: 0;
	line-height: 2;
}

#app {
	width: 100%;
	height: 100%;
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #eee;
	overflow: hidden;
	display: flex;
	background: url("~@/assets/background.svg") no-repeat center center fixed;
	background-size: cover;
}

#app.verticalLayout {
	flex-direction: column;
}

*,
*:before,
*:after {
	box-sizing: inherit;
}

.ellipsis {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.no-select {
	user-select: none;
}

::selection {
	background: #ffffff22;
}

::-webkit-scrollbar {
	background-color: var(--background2);
	color: #aaaaaa;
}

::-webkit-scrollbar-thumb {
	background-color: var(--border);
}

::-webkit-scrollbar-thumb:hover {
	background-color: #444;
}

::-webkit-scrollbar-thumb:active {
	background-color: #333;
}

::-webkit-scrollbar-corner {
	background-color: #181a1b;
}
</style>
