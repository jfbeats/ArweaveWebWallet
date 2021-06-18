<template>
	<div id="nav">
		<SlickList class="wallets" :axis="axis" :lockAxis="axis" v-model:list="ArweaveStore.wallets" :pressDelay="200" helperClass="dragging">
			<SlickItem v-for="(wallet, i) in ArweaveStore.wallets" :index="i" :key="wallet.key" draggable="false" class="drag-container">
				<router-link class="icon wallet" :to="{name: navTo, params: { walletId: wallet.id}, query: { ...$route.query }}" :class="{'active': wallet.id == $route.params.walletId, 'axis-x': axis === 'x'}" draggable="false">
					<AddressIcon class="profile" :address="wallet.key" draggable="false" />
				</router-link>
			</SlickItem>
		</SlickList>
		<div class="controls">
			<div class="icon control" @click="createWallet()"><img class="small" src="@/assets/icons/add_box.svg"></div>
			<router-link class="icon control" to="/settings"><img class="small" src="@/assets/icons/settings.svg"></router-link>
		</div>
	</div>
</template>

<script>
import AddressIcon from '@/components/atomic/AddressIcon'
import { SlickList, SlickItem } from 'vue-slicksort';
import ArweaveStore from '@/store/ArweaveStore'
import { newWallet } from '@/functions/Wallets.js'
import { computed, onMounted, onUnmounted, ref } from "vue"

export default {
	name: 'Toolbar',
	components: { AddressIcon, SlickList, SlickItem },
	setup () {
		let windowWidth = ref(window.innerWidth)
		const onWidthChange = () => windowWidth.value = window.innerWidth
		onMounted(() => window.addEventListener('resize', onWidthChange))
		onUnmounted(() => window.removeEventListener('resize', onWidthChange))
		const axis = computed(() => windowWidth.value <= 600 ? 'x' : 'y')
		return { ArweaveStore, axis }
	},
	methods: {
		async createWallet () {
			const wallet = await newWallet()
			this.$router.push({ name: 'EditWallet', query: { wallet: wallet.id } })
		},
	},
	computed: {
		navTo () { return this.$route.matched[0]?.name === 'Wallet' ? null : 'Tx' }
	}
}
</script>

<style scoped>
#nav {
	padding: 10px;
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
	padding: 10px;
	width: 72px;
	height: 72px;
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

.dragging .wallet.axis-x {
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
	padding: 18px;
	box-shadow: 0 0 12px 1px #00000044;
}

.small {
	width: 50%;
	height: 50%;
}

.control.router-link-active,
.wallet.active.router-link-active {
	box-shadow: -2px 0 0 0 var(--element-secondary);
	border-radius: var(--border-radius3);
	opacity: 1;
}

@media only screen and (max-width: 600px) {
	.control.router-link-active,
	.wallet.active.router-link-active {
		box-shadow: 0 -2px 0 0 var(--element-secondary);
	}
}
</style>
