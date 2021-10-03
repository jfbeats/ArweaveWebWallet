<template>
	<div>
		<div>Size {{ txSizeDisplay }}</div>
		<div>Fee
			<Ar class="ar" :ar="userFeeAr" />&nbsp;<LocaleCurrency class="small secondary" :ar="userFeeAr">|</LocaleCurrency>
		</div>
		<Slider v-model="slider" :settings="sliderSettings" :progress="progress" />
	</div>
</template>

<script>
import Slider from '@/components/atomic/Slider.vue'
import Ar from '@/components/atomic/Ar.vue'
import LocaleCurrency from '@/components/atomic/LocaleCurrency.vue'
import ArweaveStore, { arweave } from '@/store/ArweaveStore'
import BlockStore from '@/store/BlockStore'
import { getFeeRange } from '@/functions/Transactions'
import { debounce, humanFileSize } from '@/functions/Utils'
import axios from 'axios'
import BigNumber from 'bignumber.js'
import { computed, reactive, ref, watch } from 'vue'

export default {
	components: { Slider, Ar, LocaleCurrency },
	props: ['target', 'size'],
	setup (props, { emit }) {

		const txSizeDisplay = computed(() => humanFileSize(props.size))
		const feeUrl = computed(() => {
			const address = props.target
			return ArweaveStore.gatewayURL + 'price/' + props.size + '/' + (address.match(/^[a-z0-9_-]{43}$/i) ? address : '')
		})
		const txFee = ref(null)
		const updateFee = async () => { txFee.value = (await axios.get(feeUrl.value)).data }
		const updateFeeDebounced = debounce(updateFee)
		updateFee()
		watch(() => feeUrl.value, () => {
			txFee.value = null
			updateFeeDebounced()
		})

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
		const factorInBaseFee = (fee) => {
			if (!fee || !txFee.value) { return null }
			return fee.minus(txFee.value) > 0 ? fee.minus(txFee.value) : new BigNumber('0')
		}

		const userFee = computed(() => {
			if (!txFee.value || !slider.value) { return null }
			const txFeeBn = new BigNumber(txFee.value)
			const sliderBn = new BigNumber(slider.value)
			return txFeeBn.plus(sliderBn)
		})
		const userFeeAr = computed(() => {
			if (!userFee.value) { return null }
			return arweave.ar.winstonToAr(userFee.value)
		})
		watch(userFeeAr, userFeeAr => emit('update', userFeeAr))

		const progress = computed(() => !!sliderSettings.value.max && BlockStore.mempoolStatus.progress)

		return { txSizeDisplay, userFeeAr, slider, sliderSettings, progress }
	}
}
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
