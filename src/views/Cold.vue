<template>
	<div class="cold">
		<Flow ref="flow" class="flex-column" :index="index">
			<Link class="flow-item" key="1" :run="() => flow.nav(1)">
				<div class="flow-item-content flex-column" style="width: var(--popup-width);">
					<SecurityVisual style="opacity: 0.75; margin: -3%; width: 90%; align-self: center" />
					<div>There are steps you can take to generate and use your keys in a way that relies on no single trusted party. It is possible to turn any device into a secure Permafrost Vault to interact with these account.</div>
				</div>
			</Link>
			<Link class="flow-item" key="2" :run="() => flow.nav(1)">
				<div class="flow-item-content flex-column">
					<div>1/4 | Prevent potential leaks.</div>
					<div>Keep your devices offline before and after importing vault accounts and validate all communications before they are submitted through QR codes or files. Compromised software or hardware may preserve secret information in memory and wait indefinitely for any opportunity to relay it to bad actors.</div>
				</div>
			</Link>
			<Link class="flow-item" key="3" :run="() => flow.nav(1)">
				<div class="flow-item-content flex-column">
					<div>2/4 | Avoid using fake private keys.</div>
					<div>
						Ensure that your passphrase comes from true randomness by generating it yourself. Collect 12 random numbers between 1 and 2048 from different sources and replace each one by its
						<Link to="wordlist" target="_blank">corresponding word.</Link>
						Compromised software or hardware could attempt to provide passphrases that someone else already has access to.
					</div>
					<div>
						Note that generating your passphrase manually will likely lead to a message indicating that the generation was not from this app, but it is fine to proceed.
					</div>
				</div>
			</Link>
			<Link class="flow-item" key="4" :run="() => flow.nav(1)">
				<div class="flow-item-content flex-column">
					<div>3/4 | Avoid using fake addresses.</div>
					<div>Check that the key derivation process is safely executed. By importing multiple randomly generated test passphrases inside cold wallets and separate devices from different manufacturers, operating systems, and wallet software, you are able to verify that every single passphrase is producing the correct account. Compromised software or hardware could attempt to display the wrong address in order to divert funds.</div>
				</div>
			</Link>
			<Link class="flow-item" key="5" :run="() => flow.nav(1)">
				<div class="flow-item-content flex-column">
					<div>4/4 | Be safe against equipment failures.</div>
					<div>Always send test transactions before transferring or receiving large amounts to confirm that everything is working correctly. It is your responsibility to select the appropriate security based on the risks involved.</div>
				</div>
			</Link>
			<div class="flow-item" key="6">
				<div class="flow-item-content flex-column">
<!--					todo fix not responsive, breaks when going back online  -->
					<div>Get lifetime access to the Permafrost Vault for an unlimited number of accounts and devices for {{ humanFileSize(byteSize) }} worth of arweave storage (<Amount :ar="feeManager.ar"> | </Amount>).</div>
					<Button v-bind="feeAction" :glow="true">{{ feeAction.name }}</Button>
					<div class="cards flex-column">
						<TxCard v-for="tx in feeManager.txs" :tx="tx.node" />
					</div>
				</div>
			</div>
			<div class="flow-item" key="7" v-if="lastPage">
				<div class="flow-item-content flex-column" style="width: var(--popup-width);">
					<SecurityVisual :color="coldWalletAction.color" :light="true" style="opacity: 0.75; margin: -3%; width: 90%; align-self: center" />
					<Button v-bind="coldWalletAction" :glow="true">{{ coldWalletAction.name }}</Button>
				</div>
			</div>
		</Flow>
	</div>
</template>



<script setup lang="ts">
import Flow from '@/components/layout/Flow.vue'
import SecurityVisual from '@/components/visual/SecurityVisual.vue'
import Link from '@/components/function/Link.vue'
import { fee } from '@/functions/Fee'
import { humanFileSize, round } from '@/functions/Utils'
import Amount from '@/components/composed/Amount.vue'
import Button from '@/components/atomic/Button.vue'
import TxCard from '@/components/composed/TxCard.vue'
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from '@/router'
import { coldState, getColdWalletAction, prepare } from '@/store/Cold'

const flow = ref(undefined as undefined | InstanceType<typeof Flow>)
const router = useRouter()

const byteSize = 5 * 1024 * 1024 * 1024
const feeManager = fee({ name: 'Cold', byteSize })
const index = ref(undefined as undefined | number)
watch(index, i => i != undefined && setTimeout(() => index.value = undefined))
const feeRoute = async () => {
	if (feeManager.isPaid) { return index.value = 6 }
	const promise = feeManager.pay().catch(e => console.error(e))
	router.push({ name: 'Connect' })
	await promise
	await router.push({ name: 'Cold', query: { page: '6' } })
}
const feeAction = computed(() => ({
	run: feeRoute,
	name: feeManager.isPaid ? 'Paid'
		: feeManager.txs.length ? `Pay remaining ${round(feeManager.remaining)} AR`
			: feeManager.isPaying ? 'Loading' : 'Pay',
}))
const lastPage = computed(() => feeManager.isPaid || coldState.value?.status)
const coldWalletAction = computed(() => getColdWalletAction(true))
onMounted(() => prepare())
</script>



<style scoped>
.cold {
	height: var(--current-vh);
}

.flow {
	height: 100%;
	flex: 1 1 0;
}

.flow-item {
	align-items: center;
	justify-content: center;
}

.flow-item-content {
	text-align: justify;
	width: var(--column-width-small);
	min-width: 0;
	padding: var(--spacing);
	
}

.cards {
	flex: 1 1 0;
}
</style>