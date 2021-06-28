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
		<template #right>
			<div v-if="data.handler" class="data-view">
				<div v-if="data.handler === 'iframe'" class="frame-background">
					<iframe class="iframe" :src="ArweaveStore.gatewayURL + tx.id" />
				</div>
				<div v-if="data.handler === 'img'" class="frame-background">
					<img class="img" :src="ArweaveStore.gatewayURL + tx.id">
				</div>
				<div v-if="data.handler === 'json'" class="card-background">
					<pre class="raw">{{ data.payload }}</pre>
				</div>
				<div v-if="data.handler === 'raw'" class="card-background">
					<div class="raw">{{ data.payload }}</div>
				</div>
			</div>
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
		return { ArweaveStore, tx, data, isData, isPending, date, verticalContent }
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

.data-view {
	/* padding: var(--spacing); */
}

.frame-background {
	width: 100%;
	height: 100vh;
	background: var(--background3);
	border: 2px solid #666;
	border-radius: 32px 0 0 32px;
	overflow: hidden;
}

.verticalContent .frame-background {
	height: 80vh;
	border-radius: 32px 32px 0 0;
}

.card-background {
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
	padding: var(--spacing);
	background: var(--background2);
	border: 1px solid var(--border);
	border-radius: var(--border-radius);
	overflow: auto;
}
</style>