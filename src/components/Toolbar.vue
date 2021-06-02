<template>
	<div id="nav" @drop.prevent="droppedFiles" @dragover.prevent>
		<SlickList class="wallets" lockAxis="y" v-model:list="ArweaveStore.wallets" :distance="10">
			<SlickItem v-for="(wallet, i) in ArweaveStore.wallets" :index="i" :key="wallet.key">
				<router-link class="icon wallet" :to="{name: 'Wallet', query: {wallet: wallet.id}}" :class="{'active': wallet === ArweaveStore.currentWallet}" draggable="false">
					<!-- <img src="ArLogo.svg" draggable="false"> -->
					<AddressIcon class="profile" :address="wallet.key" draggable="false" />
				</router-link>
			</SlickItem>
		</SlickList>
		<div class="controls">
			<div class="icon control" @click="newPassphrase()"><img class="small" src="add_box.svg"></div>
			<router-link class="icon control" to="/settings"><img class="small" src="settings.svg"></router-link>
		</div>
	</div>
</template>

<script>
import AddressIcon from '@/components/atomic/AddressIcon'
import { SlickList, SlickItem } from 'vue-slicksort';
import { ArweaveStore } from '@/store/ArweaveStore'
import { newWallet, newPassphrase } from '@/functions/Wallets.js'

export default {
	name: 'Toolbar',
	components: {
		AddressIcon, SlickList, SlickItem,
	},
	setup () {
		return {
			ArweaveStore, newWallet, newPassphrase
		}
	},
	methods: {
		async droppedFiles (e) {
			const idPromises = []
			for (const file of e.dataTransfer.files) {
				const idPromise = newWallet(JSON.parse(await file.text()))
				idPromises.push(idPromise)
			}
			const ids = (await Promise.all(idPromises)).filter(e => e !== null)
			if (ids.length > 0) {
				this.$router.push({ name: 'EditWallet', query: { wallet: ids } })
			}
		}
	},
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

.icon {
	padding: 10px;
	display: inline-block;
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
	transition: box-shadow 0.2s ease;
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

.wallet.active.router-link-active .profile {
	/* box-shadow: 0 0 8px 0 #1e1e1e; */
}
</style>
