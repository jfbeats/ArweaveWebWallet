<template>
	<div class="tx-icon" :class="{ isPending }" :style="styleObject">
		<component :is="icon" class="tx-svg" />
		<transition name="fade">
			<Icon v-if="isPending || uploadProgress" icon="loader" :progress="uploadProgress" class="loader" />
		</transition>
	</div>
</template>



<script setup lang="ts">
import Icon from '@/components/atomic/Icon.vue'
import ArweaveStore from '@/store/ArweaveStore'
import { unpackTags } from '@/functions/Transactions'
import { computed } from 'vue'

import IconTxIn from '@/assets/icons/tx_in.svg?component'
import IconTxOut from '@/assets/icons/tx_out.svg?component'
import IconTxInData from '@/assets/icons/tx_in_data.svg?component'
import IconTxOutData from '@/assets/icons/tx_out_data.svg?component'
import IconCube from '@/assets/icons/cube.svg?component'
import IconTxInFull from '@/assets/icons/tx_in_full.svg?component'
import IconTxOutFull from '@/assets/icons/tx_out_full.svg?component'

const props = defineProps<{
	tx: any
	direction: 'in' | 'out'
}>()

const isData = computed(() => (props.tx.data?.size || props.tx.data_size) > 0)
const isValue = computed(() => (props.tx.quantity?.winston || props.tx.quantity) > 0)
const isPending = computed(() => !props.tx.id || !props.tx.block)
const uploadProgress = computed(() => ArweaveStore.uploads[props.tx.id]?.upload)
const icon = computed(() => {
	if (props.direction === 'in' && !isData.value) return IconTxIn
	if (props.direction === 'out' && !isData.value) return IconTxOut
	if (props.direction === 'in' && !isValue.value) return IconTxInData
	if (props.direction === 'out' && !isValue.value)
		if (unpackTags(props.tx.tags)['Bundle-Version']) return IconCube
	 	else return IconTxOutData
	if (props.direction === 'in') return IconTxInFull
	if (props.direction === 'out') return IconTxOutFull
})
const styleObject = computed(() => ({
	color: isData.value && !isValue.value ? 'var(--orange)' : props.direction === 'in' ? 'var(--green)' : 'var(--red)',
}))
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
</style>