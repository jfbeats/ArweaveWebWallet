<template>
	<div v-if="data.handler === 'iframe'" v-show="data.loaded" key="iframe" class="frame-container">
		<iframe class="iframe" :src="ArweaveStore.gatewayURL + tx.id" @load="data.loaded=true" />
	</div>
	<div v-else-if="data.handler === 'img'" v-show="data.loaded" key="img" class="frame-container">
		<img class="img" :src="ArweaveStore.gatewayURL + tx.id" @load="data.loaded=true">
	</div>
	<div v-else-if="data.handler === 'smartweave'" key="smartweave">
		<SmartWeave :tx="tx" />
	</div>
	<div v-else-if="data.handler === 'json' || data.handler === 'raw'" key="json" class="data-container">
		<pre class="raw">{{ data.payload }}</pre>
	</div>
</template>

<script>
import ArweaveStore, { arweave } from '@/store/ArweaveStore'
import SmartWeave from '@/components/handlers/SmartWeave.vue'
import { reactive, watch } from 'vue'

export default {
	components: { SmartWeave },
	props: ['tx'],
	setup (props) {
		const data = reactive({
			handler: null,
			loaded: false,
			payload: null,
		})

		watch(() => props.tx, async () => {
			if (!props.tx) { return }
			data.handler = null
			data.loaded = false
			if (props.tx.data?.size === '0') {
				return
			} else if (props.tx.data?.type === 'application/x.arweave-manifest+json' || props.tx.data?.type === 'text/html' || props.tx.data?.type === 'application/pdf') {
				data.handler = 'iframe'
			} else if (props.tx.data?.type?.split('/')[0] === 'image') {
				data.handler = 'img'
			// } else if (props.tx.tags?.find(el => el.name === 'App-Name')?.value === 'SmartWeaveContract') {
			// 	data.handler = 'smartweave'
			} else {
				data.handler = 'raw'
				try {
					data.payload = await arweave.transactions.getData(props.tx.id, { decode: true, string: true })
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

		return { ArweaveStore, data }
	}
}
</script>

<style scoped>
.frame-container {
	
	width: 100%;
	/* height: 100vh; */
	background: var(--background2);
	box-shadow: 0 0 0 2px #aaa;
	border-radius: 32px;
	display: flex;
	flex-direction: column;
	overflow: hidden;
}

.data-container {
	padding: var(--spacing);
	background: var(--background2);
	outline: 0.5px solid var(--border);
	/* min-height: 100vh; */
}

.iframe {
	width: 100%;
	height: 100%;
	border: 0;
	opacity: 0.6;
}

.img {
	flex: 1 1 0;
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
</style>