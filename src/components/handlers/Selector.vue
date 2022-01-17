<template>
	<div v-if="data.handler === 'intent'" @click="data.intent = true" class="selector data-container box" style="display: flex; justify-content: center; padding-top: 5em;">
		<Button :icon="IconDownload">Load large file</Button>
	</div>
	<div v-else-if="data.handler === 'iframe'" v-show="data.loaded" key="iframe" class="selector iframe-container box">
		<iframe class="iframe" :src="gatewayLink" @load="data.loaded = true" />
	</div>
	<div v-else-if="data.handler === 'img'" v-show="data.loaded" key="img" class="selector img-container box">
		<Img :src="gatewayLink" @load="data.loaded = true" />
	</div>
	<div v-else-if="data.handler === 'smartweave'" key="smartweave" class="selector iframe-container box">
		<iframe class="iframe" :src="'https://arcode.studio/#/' + tx.id + '?theme=dark-blue&hideToolbar=true'" @load="data.loaded = true" style="opacity:1;"/>
	</div>
	<div v-else-if="data.handler === 'json' || data.handler === 'raw'" key="json" class="selector data-container box">
		<pre class="raw">{{ data.payload }}</pre>
	</div>
</template>



<script setup>
import ArweaveStore, { arweave } from '@/store/ArweaveStore'
import Img from '@/components/handlers/Img.vue'
import Button from '@/components/atomic/Button.vue'
import { computed, reactive, watch } from 'vue'
import { unpackTags } from '@/functions/Transactions'
import IconDownload from '@/assets/icons/download.svg?component'

const props = defineProps(['tx'])

const data = reactive({
	handler: null,
	loaded: false,
	payload: null,
	intent: false,
})

const gatewayLink = computed(() => ArweaveStore.gatewayURL + props.tx.id)

const load = async () => {
	if (!props.tx) { return }
	if (props.tx.data?.size === '0') { return }
	const tags = unpackTags(props.tx.tags)
	if (tags['Bundle-Version']) { return }
	if (props.tx.data?.size > 104857600 && !data.intent) { return data.handler = 'intent' }
	if (props.tx.data?.type === 'application/x.arweave-manifest+json' || props.tx.data?.type === 'text/html' || props.tx.data?.type === 'application/pdf') { return data.handler = 'iframe' }
	if (props.tx.data?.type?.split('/')[0] === 'image') { return data.handler = 'img' }
	if (tags['App-Name'] === 'SmartWeaveContract' || tags['App-Name'] === 'SmartWeaveContractSource') { return data.handler = 'smartweave' }
	else {
		data.handler = 'raw'
		try {
			data.payload = await arweave.transactions.getData(props.tx.id, { decode: true, string: true })
			if (data.payload[0] === "{") {
				try {
					data.payload = JSON.stringify(JSON.parse(data.payload), null, 2)
					data.handler = 'json'
				} catch (e) { }
			}
		} catch (e) { }
	}
}

watch(() => props.tx.id, () => {
	data.intent = false
	data.handler = null
	data.loaded = false
	load()
}, { immediate: true })

watch(() => data.intent, () => {
	data.intent && load()
})
</script>



<style scoped>
.iframe-container,
.img-container,
.data-container {
	width: 100%;
	padding: 0;
}

.iframe-container,
.img-container {
	/* height: var(--current-vh); */
	display: flex;
	flex-direction: column;
}

.data-container {
	min-height: var(--current-vh);
	padding: var(--spacing);
}

.iframe {
	flex: 1 1 0;
	width: 100%;
	height: 100%;
	border: 0;
	opacity: 0.5;
	transition: opacity 0.6s ease;
}

.iframe:hover, .iframe:active {
	opacity: 1;
}

.raw {
	overflow: auto;
	padding: var(--spacing);
	margin: 0;
	white-space: pre-wrap;
}
</style>