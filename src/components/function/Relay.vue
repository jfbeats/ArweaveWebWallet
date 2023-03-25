<template>
	<Viewport :background="true">
		<Popup v-if="relayRequest" :padding="false">
			<div class="export">
				<div class="flex-row" style="width: 100%; justify-content: space-between; align-items: center; padding: var(--spacing);">
<!--					<TxCard :tx="exportRequest?.entry.tx" :options="{ half: true }" />-->
					<div></div>
					<WalletSelector v-model="walletId" @exit="reject" :active="true"  />
				</div>
				<Flow ref="flow" class="flex-column">
					
					<FadeOverflow class="flow-item" key="1">
						<Link :run="() => flow.nav(1)" class="flow-item-content flex-column">
							<SecurityVisual style="opacity: 0.75; margin: -3%; width: 90%; align-self: center" />
							<div>An online device must be used as a relay to initialize and conclude the transaction signing process. The relay will:</div>
							<div>
								<div>- Collect the required public network data online</div>
								<div>- Apply vault signatures and submit finalized transactions</div>
							</div>
						</Link>
					</FadeOverflow>
					
					<FadeOverflow class="flow-item" key="2">
						<Link class="flow-item-content flex-column">
							<div style="align-self: center">Communicate this data to the online device</div>
							<QR :qr="txString"/>
							<div class="flex-row" style="align-items: stretch; justify-content: stretch;">
								<Button :run="doDownload" style="flex: 1 1 auto; height: initial;">Download File</Button>
								<Button :square="true" :run="share" :icon="ICON.share" />
							</div>
						</Link>
					</FadeOverflow>
					
				</Flow>
			</div>
		</Popup>
	</Viewport>
</template>



<script setup lang="ts">
import Viewport from '@/components/layout/Viewport.vue'
import Popup from '@/components/layout/Popup.vue'
import WalletSelector from '@/components/composed/WalletSelector.vue'
import Button from '@/components/atomic/Button.vue'
import QR from '@/components/atomic/QR.vue'
import Link from '@/components/function/Link.vue'
import SecurityVisual from '@/components/visual/SecurityVisual.vue'
import FadeOverflow from '@/components/function/FadeOverflow.vue'
import { relayRequest } from '@/functions/Export'
import { computed, ref } from 'vue'
import { download } from '@/functions/File'
import { ICON } from '@/store/Theme'
import Flow from '@/components/layout/Flow.vue'

const flow = ref(undefined as undefined | InstanceType<typeof Flow>)

const txString = computed(() => {
	return JSON.stringify(relayRequest.value?.walletData, null, 2)
})
const walletId = computed(() => relayRequest.value?.wallet.id)
const doDownload = () => {
	if (!txString.value) { return }
	download('PublicKey.json', txString.value)
}
const share = () => navigator.share({ text: txString.value })
const reject = () => relayRequest.value = undefined
</script>



<style scoped>
.export {
	align-items: stretch;
	justify-content: center;
	max-width: 100%;
	/*width: var(--popup-width);*/
	display: flex;
	flex-direction: column
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

/*.carousel {*/
/*	width: 100%;*/
/*	flex: 1 1 auto;*/
/*}*/

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

.flow {
	
	/*height: 100%;*/
	/*flex: 1 1 0;*/
	width: 100%;
	flex: 1 1 auto;
	min-height: 0;
}

.flow-item {
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	display: inline-flex;
	/*align-items: start;*/
	overflow: auto;
}

.flow-item-content {
	text-align: justify;
	/*width: var(--column-width-small);*/
	min-width: 0;
	padding: var(--spacing);
	margin: auto;
	min-height: 100%;
	max-width: 100%;
	overflow: hidden;
	justify-content: center;
	/*width: var(--popup-width);*/
}
</style>