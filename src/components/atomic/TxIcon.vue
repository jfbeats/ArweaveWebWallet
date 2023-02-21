<template>
	<Observer class="tx-icon" :class="{ isPending: options.status === 'pending' }" :style="styleObject" @intersection="intersection">
		<Icon :icon="icon" class="tx-svg" />
		<transition name="fade">
			<Icon v-if="options.status === 'pending' || uploadProgress" icon="loader" :progress="uploadProgress" class="loader" />
		</transition>
		<transition name="fade-fast">
			<img class="image" v-if="src && canLoad" v-show="loaded" @load="loaded = true" :src="src" alt="thumbnail" draggable="false" @dragstart.prevent />
		</transition>
	</Observer>
</template>



<script setup lang="ts">
import Icon from '@/components/atomic/Icon.vue'
import Observer from '@/components/function/Observer.vue'
import ArweaveStore from '@/store/ArweaveStore'
import { unpackTags } from '@/functions/Transactions'
import { computed, ref, watch } from 'vue'

import IconTxIn from '@/assets/icons/tx_in.svg?component'
import IconTxOut from '@/assets/icons/tx_out.svg?component'
import IconTxInData from '@/assets/icons/tx_in_data.svg?component'
import IconTxOutData from '@/assets/icons/tx_out_data.svg?component'
import IconCube from '@/assets/icons/cube.svg?component'
import IconTxInFull from '@/assets/icons/tx_in_full.svg?component'
import IconTxOutFull from '@/assets/icons/tx_out_full.svg?component'

export type TxDisplayOptions = {
	isData: boolean
	isValue: boolean
	direction: 'in' | 'out'
	status: 'local' | 'pending' | 'confirmed'
}

const props = defineProps<{
	tx: any
	options: TxDisplayOptions
}>()

const tags = computed(() => unpackTags(props.tx.tags, { lowercase: true }))
const uploadProgress = computed(() => ArweaveStore.uploads[props.tx.id]?.upload)
const icon = computed(() => {
	if (tags.value['bundle-version']) return IconCube
	if (props.options.direction === 'in' && !props.options.isData) return IconTxIn
	if (props.options.direction === 'out' && !props.options.isData) return IconTxOut
	if (props.options.direction === 'in' && !props.options.isValue) return IconTxInData
	if (props.options.direction === 'out' && !props.options.isValue) return IconTxOutData
	if (props.options.direction === 'in') return IconTxInFull
	if (props.options.direction === 'out') return IconTxOutFull
})
const styleObject = computed(() => ({
	color: props.options.isData && !props.options.isValue ? 'var(--orange)' : props.options.direction === 'in' ? 'var(--green)' : 'var(--red)',
}))
const src = computed(() => !props.options.isValue && tags.value['content-type']?.startsWith('image') && (ArweaveStore.gatewayURL + props.tx.id) || undefined)
const loaded = ref(false)
const canLoad = ref(false)
const intersecting = ref(false)
const intersection = (e: IntersectionObserverEntry) => { intersecting.value = e.isIntersecting }
watch(() => ({ src: src.value, intersecting: intersecting.value }), async (value, oldValue) => {
	if (value.src !== oldValue?.src) { loaded.value = false }
	if (!!value.src == value.intersecting) { canLoad.value = value.intersecting }
}, { immediate: true })
</script>



<style scoped>
.tx-icon {
	position: relative;
}

.tx-svg {
	padding: 8px;
	width: 100%;
	height: 100%;
	transition: padding 0.4s ease;
}

.isPending .tx-svg {
	padding: 25%;
}

.loader {
	width: 48px;
	height: 48px;
}

.loader {
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
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
	border-radius: inherit;
	overflow: hidden;
}
</style>