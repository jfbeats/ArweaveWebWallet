<template>
	<div class="address-icon no-select">
		<transition name="fade-fast">
			<Identicon class="identicon" v-if="isValid && address" :address="address" alt="wallet logo" draggable="false" @dragstart.prevent />
			<IconCloud v-else class="identicon cloud" draggable="false" @dragstart.prevent />
		</transition>
		<transition name="fade-fast">
			<img class="image" v-if="isValid && arweaveId?.Image" v-show="loaded" @load="loaded = true" :src="ArweaveStore.gatewayURL + arweaveId?.Image" alt="wallet profile picture" draggable="false" @dragstart.prevent />
		</transition>
	</div>
</template>



<script>
import ArweaveStore from '@/store/ArweaveStore'
import Identicon from '@/components/atomic/Identicon.vue'
import ProfileStore, { getArweaveId } from '@/store/ProfileStore'
import { computed, watch, ref } from 'vue'

import IconCloud from '@/assets/icons/cloud.svg?component'

export default {
	props: ['address'],
	components: { Identicon, IconCloud },
	setup (props) {
		const isValid = computed(() => props.address?.match(/^[a-z0-9_-]{43}$/i))
		const arweaveId = computed(() => ProfileStore.arweaveId[props.address])
		const loaded = ref(false)
		watch(() => props.address, async () => {
			loaded.value = false
			getArweaveId(props.address)
		}, { immediate: true })

		return { ArweaveStore, isValid, arweaveId, loaded }
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
	position: absolute;
	padding: inherit;
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