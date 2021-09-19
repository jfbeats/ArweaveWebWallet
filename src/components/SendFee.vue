<template>
	<div>
		<div>Size {{ txSizeDisplay }}</div>
		<div>Fee
			<Ar class="ar" :ar="txFee" />&nbsp;<LocaleCurrency class="small secondary" :ar="txFee">|</LocaleCurrency>
		</div>
		<!-- <Slider /> -->
	</div>
</template>

<script>
import Slider from '@/components/atomic/Slider.vue'
import Ar from '@/components/atomic/Ar.vue'
import LocaleCurrency from '@/components/atomic/LocaleCurrency.vue'
import ArweaveStore, { arweave } from '@/store/ArweaveStore'
import { debounce, humanFileSize } from '@/functions/Utils'
import axios from 'axios'
import { computed, ref, watch } from 'vue'

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
		watch(() => txFee.value, (value) => emit('update', value))

		const updateFee = async () => { txFee.value = arweave.ar.winstonToAr((await axios.get(feeUrl.value)).data) }
		const updateFeeDebounced = debounce(updateFee)
		updateFee()
		watch(() => feeUrl.value, () => {
			txFee.value = null
			updateFeeDebounced()
		})

		return {txSizeDisplay, txFee}
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
