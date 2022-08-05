<template>
	<div class="tx-icon" :class="{ isPending: options.status === 'pending' }" :style="styleObject">
		<Icon :icon="icon" class="tx-svg" />
		<transition name="fade">
			<Icon v-if="options.status === 'pending' || uploadProgress" icon="loader" :progress="uploadProgress" class="loader" />
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

const uploadProgress = computed(() => ArweaveStore.uploads[props.tx.id]?.upload)
const icon = computed(() => {
	if (unpackTags(props.tx.tags)['Bundle-Version']) return IconCube
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