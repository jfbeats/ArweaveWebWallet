<template>
<div class="wrapper" @click="test=!test" :class="{test: test}">
	<div class="address-icon" >
		<img class="identicon" :src="identicon" draggable="false">
		<img class="profile" v-if="url" :src="url" draggable="false">
	</div>
	<div class="content" v-if="test" >
		<div>Some profile info here</div>
		<div>And here</div>
	</div>
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
.wrapper {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 48px;
	height: 48px;
	transition: all 0.4s ease;
	overflow: hidden;
}

.content {
	/* padding: 12px; */
	flex: 1 1 0;
	/* height: 0; */
	display: flex;
	flex-direction: column;
	justify-content: center;
	/* width: 0; */
}

.test {
	height: auto;
	width:100%;
	height: 400px;
}

.test .address-icon {
	padding: 48px;
}

.address-icon {
	display: flex;
	padding: 12px;
	transition: all 0.4s ease;

}

.identicon {
	/* width: 100%;
	height: 100%; */
	width: 24px;
	heigth: 24px;
}
</style>