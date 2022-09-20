<template>
	<div>
		<div>Size {{ txSizeDisplay }}</div>
		<div>
			Fee
			<Amount :ar="userFeeAr" />
		</div>
		<Slider v-model="slider" :settings="sliderSettings" :progress="progress" />
	</div>
</template>



<script setup lang="ts">
import Slider from '@/components/form/Slider.vue'
import Amount from '@/components/composed/Amount.vue'
import { ArweaveAccount } from '@/providers/Arweave'
import { arweave } from '@/store/ArweaveStore'
import BlockStore from '@/store/BlockStore'
import { getFeeRange } from '@/functions/Transactions'
import { debounce, humanFileSize } from '@/functions/Utils'
import BigNumber from 'bignumber.js'
import { computed, reactive, ref, watch } from 'vue'

const props = defineProps<{
	target: string
	size?: string
}>()
const emit = defineEmits<{
	(e: 'update', value: string | undefined): void
}>()

const address = computed(() => ArweaveAccount.metadata.isAddress(props.target.slice(0,43)) ? props.target.slice(0,43) : '')
const txFee = ref(undefined as undefined | string)
const updateFee = async () => { props.size && (txFee.value = await arweave.transactions.getPrice(parseInt(props.size), address.value)) }
const updateFeeDebounced = debounce(updateFee)
updateFee()
watch(() => address.value + props.size, () => {
	txFee.value = undefined
	updateFeeDebounced()
})

const txSizeDisplay = computed(() => humanFileSize(props.size))

const range = reactive({})
getFeeRange().then(obj => Object.assign(range, obj))
const slider = ref('0')
const sliderSettings = computed(() => {
	const result = {
		min: new BigNumber('0'),
		minRange: factorInBaseFee(range.min),
		default: factorInBaseFee(range.default),
		maxRange: factorInBaseFee(range.max),
		max: factorInBaseFee(range.max),
	}
	slider.value = result.default || '0'
	return result
})
const factorInBaseFee = (fee: BigNumber) => {
	if (!fee || !txFee.value) { return undefined }
	return fee.minus(txFee.value).gt(0) ? fee.minus(txFee.value) : new BigNumber('0')
}

const userFee = computed(() => {
	if (!txFee.value || !slider.value) { return null }
	const txFeeBn = new BigNumber(txFee.value)
	const sliderBn = new BigNumber(slider.value)
	return txFeeBn.plus(sliderBn)
})
const userFeeAr = computed(() => {
	if (!userFee.value) { return undefined }
	return arweave.ar.winstonToAr(userFee.value)
})
watch(userFeeAr, userFeeAr => emit('update', userFeeAr))

const progress = computed(() => BlockStore.mempoolStatus.progress)
</script>



<style scoped>
.secondary {
	color: var(--element-secondary);
}

.small {
	font-size: 0.75em;
}

.slider {
	width: 100%;
}
</style>
