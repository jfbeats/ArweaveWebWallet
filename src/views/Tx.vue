<template>
	<FoldingLayout v-if="tx">
		<template #left>
			<div class="meta">
				<div class="card">
					<div class="row">
						<!-- <div class="item"> -->
						<div class="circle">
							<Ar class="ar" :ar="tx.quantity.ar" />
							<LocaleCurrency class="small" :ar="tx.quantity.ar"></LocaleCurrency>
						</div>
						<!-- </div> -->
					</div>
					<div class="row">
						<div class="item">
							<AddressIcon :address="tx.owner.address" />
							<Address class="small" :address="tx.owner.address" />
						</div>

						<div class="item">
							<AddressIcon :address="tx.recipient" />
							<Address class="small" :address="tx.recipient" />
						</div>
					</div>

				</div>
				<br>

				<h3>ID</h3>
				<div>{{ tx.id }}</div>
				<div v-if="tx.data.size > 0">Link</div>
				<br>

				<div v-if="isPending">
					<h3>Pending</h3>
				</div>
				<div v-else>
					<h3>Block</h3>
					<div>{{ tx.block.id }}</div>
					<div>{{ tx.block.height }}<template v-if="currentBlock"> / {{ currentBlock }}</template></div>
					<div>{{ date }}</div>
					<br>
				</div>

				<h3>Data</h3>
				<div>Data size {{ humanFileSize(tx.data.size) }}</div>
				<div>Fee
					<Ar class="ar" :ar="tx.fee.ar" />&nbsp;<LocaleCurrency class="small" :ar="tx.fee.ar">|</LocaleCurrency>
				</div>
				<br>

				<h3>Tags</h3>
				<div style="background: var(--background2); border-radius: var(--border-radius);">
					<InputGrid :schema="buildTagsSchema(tx.tags)" disabled />
				</div>
				<br>

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
				<div v-else-if="data.handler === 'json'" key="json" class="card-container">
					<div class="card">
						<pre class="raw">{{ data.payload }}</pre>
					</div>
				</div>
				<div v-else-if="data.handler === 'raw'" key="raw" class="card-container">
					<div class="card">
						<div class="raw">{{ data.payload }}</div>
					</div>
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
import ArweaveStore, { arweave, getTxById } from '@/store/ArweaveStore'
import InterfaceStore from '@/store/InterfaceStore'
import { humanFileSize } from '@/functions/Utils'
import { reactive, watch, computed, ref, onMounted } from 'vue'

export default {
	components: { FoldingLayout, Address, AddressIcon, InputGrid, Ar, LocaleCurrency },
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
			} else {
				console.log('getting data')
				try {
					data.payload = await arweave.transactions.getData(props.txId, { decode: true, string: true })
					try {
						data.payload = JSON.stringify(JSON.parse(data.payload), null, 2)
						if (data.payload[0] !== "{") { throw '' }
						data.handler = 'json'
					}
					catch (e) { data.handler = 'raw' }
				} catch { }
			}
		}, { immediate: true })
		const loaded = () => {
			console.log('loaded')
			data.loaded = true
		}

		const buildTagsSchema = (tags) => {
			const result = []
			for (const tag of tags) {
				result.push({
					items: [
						{ name: 'Tag', value: tag.name, attrs: { disabled: true }, icon: require('@/assets/icons/label.svg') },
						{ name: 'Value', value: tag.value, attrs: { disabled: true } }
					]
				})
			}
			return result
		}

		const currentBlock = ref(null)
		onMounted(async () => currentBlock.value = (await arweave.network.getInfo())?.height)

		return { ArweaveStore, tx, data, loaded, currentBlock, isData, isPending, date, verticalContent, buildTagsSchema, humanFileSize }
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

.card-container {
	padding: var(--spacing);
}

.card-container > .card {
	padding: 0;
	overflow: hidden;
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
}

.row {
	min-height: 2em;
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: var(--spacing);
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

.small {
	font-size: 0.75em;
	color: var(--element-secondary);
}
</style>