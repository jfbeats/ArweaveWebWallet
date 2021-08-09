<template>
	<FoldingLayout v-if="tx">
		<template #left>
			<div class="meta flex-column">

				<div class="card">
					<div class="row flex-row">
						<div class="item" style="font-size:1.5em;">
							<Ar class="ar" :ar="tx.quantity.ar" />
							<LocaleCurrency class="small" :ar="tx.quantity.ar"></LocaleCurrency>
						</div>
					</div>
					<div class="row flex-row">
						<div class="item">
							<AddressIcon :address="tx.owner.address" />
							<Address class="small" :address="tx.owner.address" />
						</div>
					</div>
					<div class="row flex-row">
						<div class="item">
							<AddressIcon :address="tx.recipient" />
							<Address class="small" :address="tx.recipient" />
						</div>
					</div>
				</div>

				<h3>Properties</h3>
				<div class="card flex-column">

					<div>
						<h3>ID</h3>
						<div class="ellipsis">{{ tx.id }}</div>
						<a v-if="tx.data.size > 0" :href="ArweaveStore.gatewayURL + tx.id" target="_blank">Link</a>
					</div>

					<div v-if="isPending">
						<h3>Pending</h3>
					</div>
					<div v-else>
						<h3>Block </h3>
						<div class="ellipsis">{{ tx.block.id }}</div>
						<span>{{ tx.block.height }}<template v-if="currentBlock"> / {{ currentBlock }}</template></span>
						<div>{{ date }}</div>
					</div>

					<div>
						<h3>Data</h3>
						<div>Data size {{ humanFileSize(tx.data.size) }}</div>
						<div>Fee
							<Ar class="ar" :ar="tx.fee.ar" />&nbsp;<LocaleCurrency class="small" :ar="tx.fee.ar">|</LocaleCurrency>
						</div>
					</div>
				</div>

				<template v-if="tagsSchema.length">
					<h3>Tags</h3>
					<div style="background: var(--background2); border-radius: var(--border-radius);">
						<InputGrid :schema="tagsSchema" disabled />
					</div>
				</template>

				<br v-if="verticalContent">

			</div>
		</template>
		<template #right v-if="data.handler">
			<transition :name="verticalContent ? 'slide-up' : 'slide-left'" appear>
				<div v-if="data.handler === 'iframe'" v-show="data.loaded" key="iframe" class="frame-container">
					<iframe class="iframe" :src="ArweaveStore.gatewayURL + tx.id" @load="data.loaded=true" />
				</div>
				<div v-else-if="data.handler === 'img'" v-show="data.loaded" key="img" class="frame-container">
					<img class="img" :src="ArweaveStore.gatewayURL + tx.id" @load="data.loaded=true">
				</div>
				<div v-else-if="data.handler === 'smartweave'" key="smartweave">
					<SmartWeave :txId="tx.id" />
				</div>
				<div v-else-if="data.handler === 'json' || data.handler === 'raw'" key="json" class="data-container">
					<pre class="raw">{{ data.payload }}</pre>
				</div>
			</transition>
		</template>
	</FoldingLayout>
</template>

<script>
import FoldingLayout from '@/components/FoldingLayout.vue'
import Address from '@/components/atomic/Address'
import AddressIcon from '@/components/atomic/AddressIcon'
import InputGrid from '@/components/atomic/InputGrid.vue'
import Ar from '@/components/atomic/Ar.vue'
import LocaleCurrency from '@/components/atomic/LocaleCurrency.vue'
import SmartWeave from '@/components/SmartWeave.vue'
import ArweaveStore, { arweave, getTxById } from '@/store/ArweaveStore'
import InterfaceStore from '@/store/InterfaceStore'
import { humanFileSize } from '@/functions/Utils'
import { reactive, watch, computed, ref, onMounted } from 'vue'

export default {
	components: { FoldingLayout, Address, AddressIcon, InputGrid, Ar, LocaleCurrency, SmartWeave },
	props: {
		txId: String,
	},
	setup (props) {
		const tx = ref(null)
		const data = reactive({
			payload: null,
			handler: null,
			loaded: false,
		})

		const isData = computed(() => tx.value.data?.size !== '0')
		const isPending = computed(() => !tx.value.block)
		const date = computed(() => {
			if (isPending.value) { return '' }
			const dateObj = new Date(tx.value.block.timestamp * 1000)
			return dateObj.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
				+ ' ' + dateObj.toLocaleTimeString()
		})
		const verticalContent = computed(() => InterfaceStore.breakpoints.verticalContent)

		watch(() => props.txId, async () => {
			tx.value = await getTxById(props.txId)
			if (!tx.value) { return }
			data.handler = null
			data.loaded = false
			if (!isData.value) {
				return
			} else if (tx.value.data?.type === 'application/x.arweave-manifest+json' || tx.value.data?.type === 'text/html' || tx.value.data?.type === 'application/pdf') {
				data.handler = 'iframe'
			} else if (tx.value.data?.type?.split('/')[0] === 'image') {
				data.handler = 'img'
			} else if (tx.value.tags?.find(el => el.name === 'App-Name')?.value === 'SmartWeaveContract') {
				data.handler = 'smartweave'
			} else {
				data.handler = 'raw'
				try {
					data.payload = await arweave.transactions.getData(props.txId, { decode: true, string: true })
					if (data.payload[0] === "{") {
						try {
							data.payload = JSON.stringify(JSON.parse(data.payload), null, 2)
							data.handler = 'json'
						}
						catch { }
					}
				} catch { }
			}
		}, { immediate: true })
		const loaded = () => { data.loaded = true }

		const tagsSchema = computed(() => {
			const result = []
			for (const tag of tx.value.tags) {
				result.push({
					items: [
						{ name: 'Tag', value: tag.name, attrs: { disabled: true } },
						{ name: 'Value', value: tag.value, attrs: { disabled: true } }
					]
				})
			}
			return result
		})

		const currentBlock = ref(null)
		onMounted(async () => currentBlock.value = (await arweave.network.getInfo())?.height)

		return { ArweaveStore, tx, data, loaded, currentBlock, isData, isPending, date, verticalContent, tagsSchema, humanFileSize }
	},
}
</script>

<style scoped>
.meta {
	max-width: 900px;
	padding: var(--spacing);
}

.verticalContent .meta {
	max-width: 100%;
}

.frame-container {
	width: 100%;
	height: 100vh;
	background: var(--background2);
	box-shadow: 0 0 0 2px #aaa;
	border-radius: 32px 0 0 32px;
	overflow: hidden;
}

.verticalContent .frame-container {
	height: 80vh;
	border-radius: 32px 32px 0 0;
}

.data-container {
	padding: var(--spacing);
	background: var(--background2);
	outline: 0.5px solid var(--border);
	min-height: 100vh;
}

.verticalContent .data-container {
	min-height: 80vh;
}

.iframe {
	width: 100%;
	height: 100%;
	border: 0;
	opacity: 0.6;
}

.img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.raw {
	overflow: auto;
	padding: var(--spacing);
	margin: 0;
	white-space: pre-wrap;
}

h3 {
	margin-bottom: 0;
}

.row {
	min-height: 2em;
	align-items: flex-start;
	justify-content: space-between;
}

.row > .item {
	flex: 1 1 0;
	min-width: 0;
	min-height: 200px;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.circle {
	flex: 0 0 auto;
	width: 200px;
	height: 200px;
	font-size: 1.5em;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	border: 4px solid var(--border);
	border-radius: 50%;
}

.address-icon {
	width: 64px;
	height: 64px;
	margin-bottom: 32px;
}

.address {
	max-width: 100%;
}

.input-grid {
	padding: var(--spacing) 0;
	background: var(--background2);
	border: 0.5px solid var(--border);
}

.small {
	font-size: 0.75em;
	color: var(--element-secondary);
}
</style>