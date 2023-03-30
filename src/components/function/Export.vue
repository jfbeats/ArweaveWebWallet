<template>
	<Viewport :background="true">
		<Popup v-if="exportRequest" :padding="false">
			<div class="export" style="display: flex; flex-direction: column">
				<div class="flex-row" style="width: 100%; justify-content: space-between; align-items: center; padding: var(--spacing);">
					<TxCard :tx="exportRequest?.entry.tx" :options="{ half: true }" />
					<WalletSelector @exit="reject" :active="true" />
				</div>
				<Carousel :options="{ align: 'center', overscroll: true, scrollSnapStop: true }" @index="i => onIndex = i" @elements="el => elements = el" :index="index">
					<FadeOverflow class="carousel-item" key="0">
						<Link class="carousel-item-content flex-column" style="width: min-content;" :run="() => nav(1)">
							<SecurityVisual style="opacity: 0.5; width: var(--popup-width); margin: -40px; align-self: center;" />
							<p v-if="reason == 'signature'" style="text-align: center; opacity: 0.8;">
								This account only has access to the public address. The transaction must be signed using the private key. You can import it or continue to use a cold wallet device
							</p>
							<p v-if="reason == 'offline'" style="text-align: center; opacity: 0.8;">
								You are currently offline. The signed transaction must be exported to a device that can communicate it back to the network
							</p>
						</Link>
					</FadeOverflow>
					<FadeOverflow class="carousel-item" key="1">
						<div class="carousel-item-content flex-column">
							<div style="align-self: center">Export {{ exportRequest?.entry.isSigned ? 'signed' : 'unsigned' }} transaction</div>
							<QR :qr="compressed"/>
							<div class="flex-row" style="align-items: stretch; justify-content: stretch;">
								<Button :run="doDownload" style="flex: 1 1 auto; height: initial;">Download File</Button>
								<Button :square="true" :run="share" :icon="ICON.share" />
							</div>
						</div>
					</FadeOverflow>
					<div v-if="InterfaceStore.online" class="carousel-item" key="2">
						<div class="carousel-item-content flex-column" style="flex: 1 1 auto;">
							<div style="align-self: center">Import signed transaction</div>
							<InputData />
						</div>
					</div>
				</Carousel>
				<Pagination :index="onIndex" @index="i => index = i" :elements="elementsLength" />
			</div>
		</Popup>
	</Viewport>
</template>



<script setup lang="ts">
import Viewport from '@/components/layout/Viewport.vue'
import Popup from '@/components/layout/Popup.vue'
import WalletSelector from '@/components/composed/WalletSelector.vue'
import Pagination from '@/components/function/Pagination.vue'
import Button from '@/components/atomic/Button.vue'
import QR from '@/components/atomic/QR.vue'
import TxCard from '@/components/composed/TxCard.vue'
import Carousel from '@/components/layout/Carousel.vue'
import Link from '@/components/function/Link.vue'
import InputData from '@/components/form/InputData.vue'
import SecurityVisual from '@/components/visual/SecurityVisual.vue'
import FadeOverflow from '@/components/function/FadeOverflow.vue'
import { exportRequest } from '@/functions/Export'
import { computed, ref, watch } from 'vue'
import { download } from '@/functions/File'
import InterfaceStore from '@/store/InterfaceStore'
import { ICON } from '@/store/Theme'

watch(exportRequest, () => index.value = 0)
const txString = computed(() => {
	if (!exportRequest.value?.entry.tx) { return }
	const entry = exportRequest.value.entry
	const { provider, tx } = entry
	return JSON.stringify(provider.trim(tx), null, 2)
})
const compressed = computed(() => {
	if (!exportRequest.value?.compressed) { return txString.value }
	const entry = exportRequest.value.entry
	const { provider } = entry
	return JSON.stringify(provider.trim(exportRequest.value?.compressed))
})
const reason = computed(() => {
	if (!exportRequest.value?.entry?.isSigned) { return 'signature' }
	else { return 'offline' }
})
const doDownload = () => {
	if (!txString.value) { return }
	download(exportRequest.value?.entry.isSigned ? 'SignedTransaction.json' : 'UnsignedTransaction.json', txString.value)
	setTimeout(() => nav(1), 2000)
}
const share = () => navigator.share({ text: txString.value }).then(() => setTimeout(() => nav(1), 2000))
const reject = () => exportRequest.value?.reject('External provider cancelled')
const index = ref(0)
const onIndex = ref(0)
const elements = ref([])
const elementsLength = ref(0)
watch(onIndex, () => index.value = onIndex.value)
watch(elements, e => elementsLength.value = e.length, { immediate: true })
const nav = (i: 1 | -1) => (index.value = onIndex.value + i)
</script>



<style scoped>
.export {
	align-items: stretch;
	justify-content: center;
	max-width: 100%;
}

.qr {
	border-radius: var(--border-radius);
	align-self: center;
}

.background {
	position: absolute;
	border-radius: inherit;
	opacity: 0.5;
	inset: 0;
	display: flex;
	justify-content: center;
	align-items: center;
}

.background-content {
	position: absolute;
	height: var(--popup-width);
	padding-bottom: 24px;
}

.content {
	flex: 1 1 0;
	position: relative;
	justify-content: space-between;
}

.carousel {
	width: 100%;
	flex: 1 1 auto;
}

.carousel-item {
	width: 100%;
	height: 100%;
	display: inline-flex;
	justify-content: center;
	align-items: start;
	overflow: auto;
}

.carousel-item-content {
	padding: var(--spacing);
	margin: auto;
	min-height: 100%;
	max-width: 100%;
	overflow: hidden;
	justify-content: center;
}
</style>