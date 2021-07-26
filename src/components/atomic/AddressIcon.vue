<template>
	<div class="address-icon no-select">
		<transition name="fade-fast" mode="out-in">
			<img class="image" v-if="isValid && url" :src="url" alt="wallet profile picture" draggable="false" @dragstart.prevent>
			<Identicon class="identicon" v-else-if="isValid && address" :address="address" alt="wallet logo" draggable="false" @dragstart.prevent />
			<img class="identicon cloud" v-else src="@/assets/icons/cloud.svg" draggable="false" @dragstart.prevent>
		</transition>
	</div>
</template>



<script>
import { get, getIdenticon } from 'arweave-id'
import { arweave } from '@/store/ArweaveStore'
import Identicon from '@/components/atomic/Identicon.vue'

export default {
	props: ['address'],
	components: { Identicon },
	data () {
		return { url: null, identicon: null, isValid: false }
	},
	watch: {
		address: {
			handler: async function (address) {
				this.isValid = address.match(/^[a-z0-9_-]{43}$/i)
				if (!this.isValid) { return }

				// const profile = await get(address, arweave)
				// if (profile.avatarDataUri) { this.url = profile.avatarDataUri }

			},
			immediate: true
		}
	}
}
</script>



<style scoped>
.address-icon {
	padding: 12px;
	position: relative;
	overflow: hidden;
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.identicon {
	width: 100%;
	height: 100%;
	max-width: 128px;
	max-height: 128px;
	object-fit: contain;
}

.image {
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	object-fit: cover;
}

.cloud {
	/* opacity: 0.2; */
	filter: opacity(0.2);
}
</style>