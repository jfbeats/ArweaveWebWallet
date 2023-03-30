<template>
	<div class="address-icon no-select">
		<transition name="fade-fast">
			<Identicon class="identicon" v-if="isValid && address" :address="address" alt="wallet logo" draggable="false" @dragstart.prevent />
			<Icon :icon="ICON.cloud" v-else class="identicon cloud" draggable="false" @dragstart.prevent />
		</transition>
		<transition :name="hasTransition ? 'fade-fast' : null">
			<img class="image" v-if="isValid && arweaveId?.image" v-show="loaded" @load="loaded = true" :src="ArweaveStore.gatewayURL + arweaveId?.image" alt="wallet profile picture" draggable="false" @dragstart.prevent />
		</transition>
	</div>
</template>



<script setup lang="ts">
import Identicon from '@/components/atomic/Identicon.vue'
import Icon from '@/components/atomic/Icon.vue'
import ArweaveStore from '@/store/ArweaveStore'
import ProfileStore, { getArweaveId } from '@/store/ProfileStore'
import { ArweaveAccount } from '@/providers/Arweave'
import { computed, watch, ref } from 'vue'
import { ICON } from '@/store/Theme'

const props = defineProps<{ address?: string }>()

const isValid = computed(() => ArweaveAccount.metadata.isAddress(props.address))
const arweaveId = computed(() => props.address && ProfileStore.arweaveId[props.address] || undefined)
const hasTransition = ref(!arweaveId.value)
watch(arweaveId, () => {
	hasTransition.value = false
	setTimeout(() => hasTransition.value = true, 200)
})
const loaded = ref(false)
watch(() => props.address, async () => {
	loaded.value = false
	getArweaveId(props.address)
}, { immediate: true })
</script>



<style scoped>
.address-icon {
	padding: 12px;
	position: relative;
	overflow: hidden;
	/*width: 100%;*/
	/*height: 100%;*/
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
	background: var(--background);
}

.cloud {
	/* opacity: 0.2; */
	filter: opacity(0.2);
}
</style>