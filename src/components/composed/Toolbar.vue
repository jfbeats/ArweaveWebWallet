<template>
	<Selector selector=".item" active=".active, .router-link-active" is="nav" class="toolbar" id="nav" :vertical="!verticalLayout" :class="{ verticalLayout }" distance="calc(var(--toolbar-spacing) / 2.5)">
		<SlickList class="wallets" :axis="axis" :lockAxis="axis" v-model:list="Wallets" :pressDelay="150" helperClass="dragging" dir="ltr" @sort-start="haptic">
			<SlickItem v-for="(wallet, i) in Wallets" :index="i" :key="wallet.key + wallet.id" draggable="false" class="drag-container">
				<router-link :to="{ name: navTo, params: { ...$route.params, walletId: wallet.id } }" custom v-slot="{ href, navigate }">
					<button type="button" class="item wallet" :href="href" @click="select(wallet, navigate)" :class="{ active: wallet.id == selected && links, accent: !links, verticalLayout }" draggable="false" @dragstart.prevent>
						<AddressIcon class="profile" :address="wallet.key" />
					</button>
				</router-link>
			</SlickItem>
		</SlickList>
		<transition name="fade-fast">
			<div class="controls" v-if="links">
				<transition name="fade-fast">
					<router-link v-if="connectors.length" class="item control" :class="{ verticalLayout }" to="/connect" aria-label="Add Wallet">
						<Icon :icon="ICON.connection" class="small" alt="Connections" />
					</router-link>
				</transition>
				<router-link class="item control" :class="{ verticalLayout }" to="/explore" aria-label="Explore">
					<Icon :icon="ICON.search" class="small" alt="Explore" />
				</router-link>
				<router-link class="item control" :class="{ verticalLayout }" to="/add" aria-label="Add Wallet">
					<Icon :icon="ICON.addBox" class="small" alt="Add Wallet" />
				</router-link>
				<router-link class="item control" :class="{ verticalLayout }" to="/settings" aria-label="Settings">
					<Icon :icon="ICON.settings" class="small" alt="Settings" />
				</router-link>
				<div v-if="state.type === 'extension'" class="item control" :class="{ verticalLayout }" @click="postMessageExtensionConnect">
					<Icon :icon="ICON.plug" class="small" alt="plug" />
				</div>
			</div>
		</transition>
	</Selector>
</template>



<script setup lang="ts">
import Selector from '@/components/atomic/Selector.vue'
import AddressIcon from '@/components/atomic/AddressIcon.vue'
import Icon from '@/components/atomic/Icon.vue'
import { SlickList, SlickItem } from 'vue-slicksort'
import InterfaceStore, { emitter } from '@/store/InterfaceStore'
import { state } from '@/functions/Channels'
import { connectors, postMessageExtension } from '@/functions/Connect'
import { Wallets } from '@/functions/Wallets'
import { computed, toRef } from 'vue'
import { useRoute, useRouter } from '@/router'
import { ICON } from '@/store/Theme'

const route = useRoute()
const router = useRouter()
const navTo = computed(() => route.matched[0]?.name === 'Wallet' ? null : 'TxList')
const select = (wallet: Account, navigate: () => any) => {
	emitter.emit('selectWallet', wallet?.key)
	if (links.value) { return navigate() }
}
const selected = computed(() => {
	if (links.value) { return route.params.walletId }
})
const verticalLayout = toRef(InterfaceStore.breakpoints, 'verticalLayout')
const axis = computed(() => verticalLayout.value ? 'x' : 'y')
const links = toRef(InterfaceStore.toolbar, 'links')
const haptic = () => navigator.vibrate?.(10)
const postMessageExtensionConnect = async () => {
	postMessageExtension('connect')
	router.push('Connect')
}
</script>



<style scoped>
#nav {
	padding: calc(var(--toolbar-spacing) / 2);
	user-select: none;
	justify-content: space-between;
}

.wallets {
	display: flex;
	flex-direction: inherit;
}

.drag-container {
	z-index: 10;
	display: flex;
	width: calc(var(--toolbar-size) - var(--toolbar-spacing));
	height: calc(var(--toolbar-size) - var(--toolbar-spacing));
}

.item {
	position: relative;
	padding: calc(var(--toolbar-spacing) / 2);
	flex: 1 1 0;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: 0.2s ease;
}

.wallet {
	opacity: var(--element-disabled-opacity);
}

.controls {
	display: flex;
	flex-direction: inherit;
	margin: calc(var(--toolbar-spacing) / 2) 0;
}

.verticalLayout .controls {
	margin: 0 calc(var(--toolbar-spacing) / 2);
}

.control {
	border-radius: var(--border-radius);
	opacity: var(--element-secondary-opacity);
	width: unset;
	height: unset;
	color: inherit;
	cursor: pointer;
}

.profile {
	background: var(--background);
	width: 100%;
	height: 100%;
	border-radius: var(--border-radius3);
	position: relative;
	transition: 0.2s ease;
}

.small {
	width: 24px;
	height: 24px;
}

.item:hover {
	opacity: 1;
}

.item.active,
.item.accent,
.item.router-link-active {
	opacity: 1;
}

.dragging .item {
	opacity: 1;
}

.dragging .item > * {
	transform: translateX(calc(100% + var(--toolbar-spacing) * 2));
}

[dir="rtl"] .dragging .item > * {
	transform: translateX(calc(-100% - var(--toolbar-spacing) * 2));
}

.dragging .item.verticalLayout > * {
	transform: translateY(calc(100% + var(--toolbar-spacing) * 2));
}
</style>
