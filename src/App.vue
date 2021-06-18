<template>
	<Toolbar class="toolbar" @drop.prevent="droppedFiles" @dragover.prevent />
	<router-view class="main" @drop.prevent="droppedFiles" @dragover.prevent v-slot="{ Component, route }">
		<transition :name="route.meta.mainTransitionName" mode="out-in">
			<component :is="Component" :key="$route.path.split('/').slice(0,3).join('')" />
		</transition>
	</router-view>
</template>



<script>
import Toolbar from '@/components/Toolbar'
import { newWallet } from '@/functions/Wallets.js'
import { useRouter } from 'vue-router'

export default {
	components: {
		Toolbar
	},
	setup () {
		const router = useRouter()
		router.afterEach((to, from) => {
			const routes = router.options.routes
			const toIndex = routes.findIndex(el => el.path === to.path)
			const fromIndex = routes.findIndex(el => el.path === from.path)
			if (toIndex === fromIndex) {
				to.meta.mainTransitionName =
				to.params.walletId < from.params.walletId ? 'slide-down' : 'slide-up'
			}
			else { to.meta.mainTransitionName = toIndex < fromIndex ? 'slide-down' : 'slide-up' }
		})
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
	scrollbar-width: none;
	z-index: 1;
	background: var(--background);
}

@media only screen and (max-width: 600px) {
	.toolbar {
		flex-direction: row;
	}
}

.toolbar::-webkit-scrollbar {
	display: none;
}

.main {
	flex: 1 1 auto;
	overflow: hidden auto;
	overflow: hidden overlay;
}
</style>



<style>
html {
	box-sizing: border-box;
	width: 100%;
	height: 100%;
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
	margin: 0;
	background: var(--background);
	min-height: 100vh;
	width: 100%;
	height: 100%;
	line-height: 2;
	background: url("~@/assets/background.svg");
	background-repeat: no-repeat;
	background-attachment: fixed;
	background-position: center;
	background-size: cover;
}

#app {
	width: 100%;
	height: 100%;
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #eee;
	margin: 0;
	padding: 0;
	display: flex;
	overflow: hidden;
}

@media only screen and (max-width: 600px) {
	#app {
		flex-direction: column;
	}
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
	width: 8px;
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
