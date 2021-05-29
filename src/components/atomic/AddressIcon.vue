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
		return { url: null, identicon: null }
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
	display: flex;
}

.identicon {
	width: 100%;
	height: 100%;
}
</style>