<template>
	<nav id="nav">
		<SlickList class="wallets" :axis="axis" :lockAxis="axis" v-model:list="wallets" :pressDelay="150" helperClass="dragging" dir="ltr">
			<SlickItem v-for="(wallet, i) in wallets" :index="i" :key="wallet.key" draggable="false" class="drag-container">
				<router-link class="icon wallet" :to="{ name: navTo, params: { walletId: wallet.id }, query: { ...$route.query } }" :class="{ active: wallet.id == $route.params.walletId, verticalLayout }" draggable="false" @dragstart.prevent>
					<AddressIcon class="profile" :address="wallet.key" />
				</router-link>
			</SlickItem>
		</SlickList>
		<div class="controls">
			<router-link class="icon control" :class="{ verticalLayout }" to="/add"><img class="small" src="@/assets/icons/add_box.svg"></router-link>
			<router-link class="icon control" :class="{ verticalLayout }" to="/settings"><img class="small" src="@/assets/icons/settings.svg"></router-link>
		</div>
		<DragOverlay />
	</nav>
</template>

<script>
import AddressIcon from '@/components/atomic/AddressIcon.vue'
import DragOverlay from '@/components/atomic/DragOverlay.vue'
import { SlickList, SlickItem } from 'vue-slicksort'
import ArweaveStore from '@/store/ArweaveStore'
import InterfaceStore from '@/store/InterfaceStore'
import { saveWalletsOrder } from '@/functions/Storage'
import { computed, toRef } from 'vue'

export default {
	name: 'Toolbar',
	components: { AddressIcon, DragOverlay, SlickList, SlickItem },
	setup () {
		const verticalLayout = toRef(InterfaceStore.breakpoints, 'verticalLayout')
		const axis = computed(() => verticalLayout.value ? 'x' : 'y')
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
		return { wallets, verticalLayout, axis }
	},
	computed: {
		navTo () { return this.$route.matched[0]?.name === 'Wallet' ? null : 'TxList' }
	}
}
</script>

<style scoped>
#nav {
	padding: 8px;
	user-select: none;
	justify-content: space-between;
}

.wallets {
	display: flex;
	flex-direction: inherit;
}

.drag-container {
	z-index: 10;
}

.icon {
	padding: 8px;
	width: 64px;
	height: 64px;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 0 0 0 #ffffff00;
	transition: 0.2s ease;
}

.wallet {
	border-radius: 18px;
	opacity: var(--element-disabled-opacity);
}

.dragging .wallet {
	opacity: 1;
	padding: 0;
	transform: translateX(calc(100% + var(--spacing)));
}

[dir="rtl"] .dragging .wallet {
	transform: translateX(calc(-100% - var(--spacing)));
}

.dragging .wallet.verticalLayout {
	transform: translateY(calc(100% + var(--spacing)));
}

.wallet:hover {
	opacity: 1;
}

.controls {
	display: flex;
	flex-direction: inherit;
}

.control {
	border-radius: 18px;
	opacity: var(--element-secondary-opacity);
}

.control:hover {
	opacity: 1;
}

.profile {
	background: var(--background3);
	padding: 12px;
	width: 100%;
	height: 100%;
	border-radius: var(--border-radius3);
	position: relative;
	transition: 0.2s ease;
}

.dragging .profile {
	padding: 14px;
	box-shadow: 0 0 12px 1px #00000044;
}

.small {
	width: 24px;
	height: 24px;
}

.control.router-link-active,
.wallet.active.router-link-active {
	opacity: 1;
	border-radius: var(--border-radius3);
	box-shadow: -5px 0 0 -3px var(--element-secondary);
}

[dir="rtl"] .control.router-link-active,
[dir="rtl"] .wallet.active.router-link-active {
	box-shadow: 5px 0 0 -3px var(--element-secondary);
}

.control.router-link-active.verticalLayout,
.wallet.active.router-link-active.verticalLayout {
	box-shadow: 0 -5px 0 -3px var(--element-secondary);
}
</style>
