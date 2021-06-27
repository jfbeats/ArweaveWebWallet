<template>
	<div v-if="tx" class="tx">
		<div class="content" :class="{ verticalContent }">
			<div class="meta">

				<div>id {{ tx.id }}</div>
				<div>block {{ !isPending ? tx.block.id : 'Pending' }}</div>
				<div>date {{ date + ' ' + time }}</div>

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

			<div v-if="data.handler" class="data-view">
				<div v-if="data.handler === 'iframe'" class="frame-background">
					<iframe  class="iframe" :src="ArweaveStore.gatewayURL + tx.id" />
				</div>
				<div v-if="data.handler === 'img'" class="frame-background">
					<img class="img" :src="ArweaveStore.gatewayURL + tx.id">
				</div>

				<pre v-if="data.handler === 'json'" class="raw">{{ data.payload }}</pre>
				<div v-if="data.handler === 'raw'" class="raw">{{ data.payload }}</div>
			</div>

		</div>
	</div>
</template>

<script>
import ArweaveStore, { arweave, getTxById } from '@/store/ArweaveStore'
import InterfaceStore from '@/store/InterfaceStore'
import { reactive, watch, computed, ref } from 'vue'

export default {
	props: {
		txId: String,
	},
	setup (props) {
		const tx = ref(null)
		const data = reactive({
			payload: null,
			handler: null,
		})
		watch(() => props.txId, async () => {
			tx.value = await getTxById(props.txId)
			data.handler = null
			if (tx.value.data?.size === 0) {
				return
			} else if (tx.value.data?.type === 'text/html' || tx.value.data?.type === 'application/pdf') {
				data.handler = 'iframe'
			} else if (tx.value.data?.type?.split('/')[0] === 'image') {
				data.handler = 'img'
			} else {
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
		const verticalContent = computed(() => InterfaceStore.breakpoints.verticalContent)
		return { ArweaveStore, tx, data, verticalContent }
	},
	computed: {
		isPending () { return !this.tx.block },
		date () {
			if (this.isPending) { return 'pending' }
			return new Date(this.tx.block.timestamp * 1000).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
		},
		time () {
			if (this.isPending) { return '' }
			return new Date(this.tx.block.timestamp * 1000).toLocaleTimeString()
		},
	}
}
</script>

<style scoped>
.content {
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: flex-start;
	align-items: flex-start;
	overflow: hidden;
}

.content.verticalContent {
	display: block;
	overflow-y: auto;
}

.meta {
	flex: 1 1 0;
	height: 100%;
	min-width: 0;
	max-width: 800px;
	padding: var(--spacing) 0 var(--spacing) var(--spacing);
	overflow: auto;
}

.verticalContent .meta {
	height: auto;
}

.meta > div {
	padding: 1em 0;
}

.tags {
	white-space: nowrap;
}

.data-view {
	height: 100%;
	flex: 1 1 0;
	min-width: 0;
	overflow: auto;
	padding: var(--spacing);
}

.verticalContent .data-view {
	height: auto;
}

.frame-background {
	width: 100%;
	height: 100%;
	background: var(--background3);
	border: 1px solid var(--border);
	border-radius: var(--border-radius);
	overflow: hidden;
}

.verticalContent .frame-background {
	height: 80vh;
}

.iframe {
	width: 100%;
	height: 100%;
	border: 0;
	filter: brightness(0.6) contrast(1.1);
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