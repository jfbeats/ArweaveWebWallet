<template>
	<nav class="toolbar" id="nav">
		<SlickList class="wallets" :axis="axis" :lockAxis="axis" v-model:list="wallets" :pressDelay="150" helperClass="dragging" dir="ltr">
			<SlickItem v-for="(wallet, i) in wallets" :index="i" :key="wallet.key" draggable="false" class="drag-container">
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



<script>
import AddressIcon from '@/components/atomic/AddressIcon.vue'
import DragOverlay from '@/components/atomic/DragOverlay.vue'
import { SlickList, SlickItem } from 'vue-slicksort'
import ArweaveStore from '@/store/ArweaveStore'
import InterfaceStore, { emitter } from '@/store/InterfaceStore'
import { connectors } from '@/functions/Connect'
import { saveWalletsOrder } from '@/functions/Wallets'
import { computed, toRef } from 'vue'
import { useRoute } from 'vue-router'

import IconConnection from '@/assets/icons/connection.svg?component'
import IconAddBox from '@/assets/icons/add_box.svg?component'
import IconSettings from '@/assets/icons/settings.svg?component'

export default {
	name: 'Toolbar',
	components: { AddressIcon, DragOverlay, SlickList, SlickItem, IconConnection, IconAddBox, IconSettings },
	setup () {
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
		const wallets = computed({
			get () {
				saveWalletsOrder(ArweaveStore.wallets)
				return ArweaveStore.wallets
			},
			set (value) {
				saveWalletsOrder(value)
				ArweaveStore.wallets = value
			}
		})
		return { navTo, select, selected, wallets, verticalLayout, axis, links, connectors }
	},
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

.icon {
	padding: calc(var(--toolbar-spacing) / 2);
	flex: 1 1 0;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 0 0 0 #ffffff00;
	transition: 0.2s ease;
}

.wallet {
	border-radius: var(--border-radius3);
	opacity: var(--element-disabled-opacity);
}

.dragging .wallet {
	opacity: 1;
	padding: 0;
	transform: translateX(calc(100% + calc(var(--toolbar-spacing) * 2)));
}

[dir="rtl"] .dragging .wallet {
	transform: translateX(calc(-100% - calc(var(--toolbar-spacing) * 2)));
}

.dragging .wallet.verticalLayout {
	transform: translateY(calc(100% + calc(var(--toolbar-spacing) * 2)));
}

.wallet:hover {
	opacity: 1;
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

.control:hover {
	opacity: 1;
}

.profile {
	background: var(--background3);
	width: 100%;
	height: 100%;
	border-radius: var(--border-radius3);
	position: relative;
	transition: 0.2s ease;
}

.dragging .profile {
	box-shadow: 0 0 12px 1px #00000044;
}

.small {
	width: 24px;
	height: 24px;
}

.control.router-link-active,
.wallet.active {
	opacity: 1;
	box-shadow: -5px 0 0 -3px var(--element-secondary);
}

.wallet.accent {
	opacity: 1;
}

[dir="rtl"] .control.router-link-active,
[dir="rtl"] .wallet.active {
	box-shadow: 5px 0 0 -3px var(--element-secondary);
}

.control.router-link-active.verticalLayout,
.wallet.active.verticalLayout {
	box-shadow: 0 -5px 0 -3px var(--element-secondary);
}
</style>
