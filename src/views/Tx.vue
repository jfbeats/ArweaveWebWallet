<template>
	<FoldingLayout v-if="tx" :class="{ verticalContent }">
		<template #left>
			<div class="meta">

				<div>id {{ tx.id }}</div>
				<div>block {{ !isPending ? tx.block.id : 'Pending' }}</div>
				<div>date {{ date }}</div>

				<div>data.size {{ tx.data.size }}</div>
				<div>fee.ar {{ tx.fee.ar }}</div>

				<div>owner.address {{ tx.owner.address }}</div>
				<div>quantity.ar {{ tx.quantity.ar }}</div>
				<div>recipient {{ tx.recipient }}</div>

				<div>Tags
					<ul class="tags">
						<li v-for="tag in tx.tags" :key="tag.name">
							{{ tag.name }} - {{ tag.value }}
						</li>
					</ul>
				</div>

				<div v-if="tx.data.size > 0">link</div>

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
					<pre class="raw card">{{ data.payload }}</pre>
				</div>
				<div v-else-if="data.handler === 'raw'" key="raw" class="card-container">
					<div class="raw card">{{ data.payload }}</div>
				</div>
			</transition>
		</template>
	</FoldingLayout>
</template>

<script>
import FoldingLayout from '@/components/FoldingLayout.vue'
import ArweaveStore, { arweave, getTxById } from '@/store/ArweaveStore'
import InterfaceStore from '@/store/InterfaceStore'
import { reactive, watch, computed, ref } from 'vue'

export default {
	components: { FoldingLayout },
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
			data.handler = null
			data.loaded = false
			if (!isData.value) {
				return
			} else if (tx.value.data?.type === 'text/html' || tx.value.data?.type === 'application/pdf') {
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
		return { ArweaveStore, tx, data, loaded, isData, isPending, date, verticalContent }
	},
}
</script>

<style scoped>
.meta {
	max-width: 700px;
	padding: var(--spacing) 0 var(--spacing) var(--spacing);
}

.meta > div {
	padding: 1em 0;
}

.tags {
	white-space: nowrap;
}

.frame-container {
	width: 100%;
	height: 100vh;
	background: var(--background3);
	box-shadow: 0 0 0 2px var(--element-secondary);
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

.iframe {
	width: 100%;
	height: 100%;
	border: 0;
	filter: brightness(0.7) contrast(1.1);
}

.img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.raw {
	overflow: auto;
}
</style>