<template>
	<div class="address-icon">
		<img class="identicon" :src="identicon" draggable="false">
		<img class="profile" v-if="url" :src="url" draggable="false">
	</div>
</template>



<script>
import { get, getIdenticon } from 'arweave-id'
import { ArweaveStore } from '@/store/ArweaveStore'
import Identicon from 'identicon.js'
import { SHA256 } from 'jshashes'

export default {
	props: ['address'],
	data () {
		return { url: null, identicon: null, test: false }
	},
	watch: {
		address: {
			handler: async function (address) {
				var options = {
					background: [0, 0, 0, 0],
					brightness: 0.6,
					saturation: 0.25,
					margin: 0,
					format: 'svg',
				}
				const hash = new SHA256
				const identiconData = new Identicon(hash.hex(address), options).toString()
				this.identicon = 'data:image/svg+xml;base64,' + identiconData
				// const profile = await get(address, ArweaveStore.arweave)
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

.profile {
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	object-fit: cover;
}
</style>