<template>
	<nav class="toolbar" id="nav">
		<SlickList class="wallets" :axis="axis" :lockAxis="axis" v-model:list="Wallets" :pressDelay="150" helperClass="dragging" dir="ltr">
			<SlickItem v-for="(wallet, i) in Wallets" :index="i" :key="wallet.key" draggable="false" class="drag-container">
				<router-link :to="{ name: navTo, params: { walletId: wallet.id }, query: { ...$route.query } }" custom v-slot="{ href, navigate }">
					<button type="button" class="icon wallet" :href="href" @click="select(wallet, navigate)" :class="{ active: wallet.id == selected && links, accent: !links, verticalLayout }" draggable="false" @dragstart.prevent>
						<AddressIcon class="profile" :address="wallet.key" />
					</button>
				</router-link>
			</SlickItem>
		</SlickList>
		<transition name="fade-fast">
			<div class="controls" v-if="links">
				<transition name="fade-fast">
					<router-link v-if="connectors.length" class="icon control" :class="{ verticalLayout }" to="/connect" aria-label="Add Wallet">
						<IconConnection class="small" alt="Connections" />
					</router-link>
				</transition>
				<router-link class="icon control" :class="{ verticalLayout }" to="/add" aria-label="Add Wallet">
					<IconAddBox class="small" alt="Add Wallet" />
				</router-link>
				<router-link class="icon control" :class="{ verticalLayout }" to="/settings" aria-label="Settings">
					<IconSettings class="small" alt="Settings" />
				</router-link>
			</div>
		</transition>
		<DragOverlay />
	</nav>
</template>



<script setup>
import AddressIcon from '@/components/atomic/AddressIcon.vue'
import DragOverlay from '@/components/atomic/DragOverlay.vue'
import { SlickList, SlickItem } from 'vue-slicksort'
import ArweaveStore from '@/store/ArweaveStore'
import InterfaceStore, { emitter } from '@/store/InterfaceStore'
import { connectors } from '@/functions/Connect'
import { Wallets } from '@/functions/Wallets'
import { computed, toRef } from 'vue'
import { useRoute } from 'vue-router'

import IconConnection from '@/assets/icons/connection.svg?component'
import IconAddBox from '@/assets/icons/add_box.svg?component'
import IconSettings from '@/assets/icons/settings.svg?component'

const route = useRoute()
const navTo = computed(() => route.matched[0]?.name === 'Wallet' ? null : 'TxList')
const select = (wallet, navigate) => {
	emitter.emit('selectWallet', wallet?.key)
	if (links.value) { return navigate() }
}
const selected = computed(() => {
	if (links.value) { return route.params.walletId }
	return ArweaveStore.currentWallet?.id
})
const verticalLayout = toRef(InterfaceStore.breakpoints, 'verticalLayout')
const axis = computed(() => verticalLayout.value ? 'x' : 'y')
const links = toRef(InterfaceStore.toolbar, 'links')
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

.icon {
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
}

.profile {
	background: var(--background3);
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

.icon:hover {
	opacity: 1;
}

.icon.active,
.icon.accent,
.icon.router-link-active {
	opacity: 1;
}

.dragging .icon > * {
	opacity: 1;
	transform: translateX(calc(100% + var(--toolbar-spacing) * 2));
	box-shadow: 0 0 12px 1px #00000044;
}

[dir="rtl"] .dragging .icon > * {
	transform: translateX(calc(-100% - var(--toolbar-spacing) * 2));
}

.dragging .icon.verticalLayout > * {
	transform: translateY(calc(100% + var(--toolbar-spacing) * 2));
}

.icon::before {
	--weight: 2px;
	--length: calc(100% - var(--toolbar-spacing));
	--offset: calc(var(--toolbar-spacing) / 2);
	--distance: -1px;
	content: '';
	background: var(--element-secondary);
	position: absolute;
	top: var(--offset);
	left: var(--distance);
	width: var(--weight);
	height: var(--length);
	opacity: 0;
	border-radius: 1px;
	transition: 0.2s ease;
}

.icon.active::before,
.icon.router-link-active::before {
	opacity: 1;
}

.dragging .icon::before {
	--offset: 0;
	--distance: calc(var(--toolbar-spacing) / -2);
	--length: 100%;
}

.icon.verticalLayout::before {
	top: var(--distance);
	left: var(--offset);
	width: var(--length);
	height: var(--weight);
}

[dir="rtl"] .icon::before {
	left: unset;
	right: var(--distance);
}

[dir="rtl"] .icon.verticalLayout::before {
	left: unset;
	right: var(--offset);
}
</style>
