<template>
	<div v-if="data.handler === 'intent'" @click="data.intent = true" class="selector data-container min-height box" style="display: flex; justify-content: center; padding-top: 5em;">
		<Button :icon="IconDownload">Load large file</Button>
	</div>
	<div v-else-if="data.handler === 'json' || data.handler === 'raw'" key="json" class="selector data-container min-height box">
		<pre class="raw">{{ data.payload }}</pre>
	</div>
	<div v-else-if="data.handler" class="selector">
		<TransitionsManager>
			<LoaderBlock v-if="!data.loaded" class="loader" />
		</TransitionsManager>
		<TransitionsManager>
			<div v-show="data.loaded" v-bind="data.handler.containerAttrs" class="box">
				<component :is="data.handler.is" v-bind="data.handler.attrs" @load="data.loaded = true" />
			</div>
		</TransitionsManager>
	</div>
</template>



<script setup lang="ts">
import ArweaveStore, { arweave, arweaveQuery } from '@/store/ArweaveStore'
import Img from '@/components/handlers/Img.vue'
import Video from '@/components/handlers/Video.vue'
import Button from '@/components/atomic/Button.vue'
import List from '@/components/layout/List.vue'
import TxCard from '@/components/composed/TxCard.vue'
import LoaderBlock from '@/components/layout/LoaderBlock.vue'
import TransitionsManager from '@/components/visual/TransitionsManager.vue'
import { computed, markRaw, reactive, watch } from 'vue'
import { unpackTags } from '@/functions/Transactions'
import IconDownload from '@/assets/icons/download.svg?component'

type Handler = {
	is: string | object
	attrs?: object
	containerAttrs?: object
}

const props = defineProps(['tx'])

const data = reactive({
	handler: undefined as undefined | Handler | 'intent' | 'raw' | 'json',
	payload: undefined as any,
	loaded: false,
	intent: false,
})

const gatewayLink = computed(() => ArweaveStore.gatewayURL + props.tx.id)
const smartweaveLink = computed(() => 'https://arcode.studio/#/' + props.tx.id + '?theme=dark-blue&hideToolbar=true')

const load = async () => {
	if (!props.tx || props.tx.data?.size === '0' || props.tx.data?.size == null) { return }
	const tags = unpackTags(props.tx.tags)
	if (tags['Bundle-Version']) {
		data.loaded = true
		return data.handler = {
			is: markRaw(List),
			attrs: { query: arweaveQuery({ bundledIn: props.tx.id }), component: markRaw(TxCard), componentProps: { options: { space: true } }, class: ['column'] },
			containerAttrs: { class: ['data-container', 'column-container', 'padding'] }
		}
	}
	if (tags['Content-Type'] === 'application/x.arweave-manifest+json' || tags['Content-Type'] === 'text/html' || tags['Content-Type'] === 'application/pdf') { return data.handler = { is: 'iframe', attrs: { src: gatewayLink.value, class: ['hover'] }, containerAttrs: { class: ['iframe-container', 'fixed-height'] } } }
	if (tags['Content-Type']?.split('/')[0] === 'video') { data.loaded = true; return data.handler = { is: markRaw(Video), attrs: { tx: props.tx }, containerAttrs: { class: ['iframe-container'] } } }
	// if (tags['Content-Type']?.split('/')[0] === 'audio') { return data.handler = { is: 'iframe', attrs: { src: gatewayLink.value }, containerAttrs: { class: ['iframe-container', 'fixed-height'] } } }
	if (props.tx.data.size > 104857600 && !data.intent) { return data.handler = 'intent' }
	if (tags['Content-Type']?.split('/')[0] === 'image') { return data.handler = { is: markRaw(Img), attrs: { src: gatewayLink.value }, containerAttrs: { class: ['img-container'] } } }
	if (tags['App-Name'] === 'SmartWeaveContract' || tags['App-Name'] === 'SmartWeaveContractSource') { return data.handler = { is: 'iframe', attrs: { src: smartweaveLink.value }, containerAttrs: { class: ['iframe-container', 'fixed-height'] } } }
	else {
		data.handler = 'raw'
		try {
			data.payload = (await arweave.api.get(props.tx.id)).data
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
	data.handler = undefined
	data.payload = undefined
	data.loaded = false
	data.intent = false
	load()
}, { immediate: true })

watch(() => data.intent, () => {
	data.intent && load()
})
</script>



<style scoped>
.selector {
	position: relative;
}

.box {
	padding: 0;
}

.iframe-container,
.img-container,
.data-container {
	width: 100%;
}

.iframe-container {
	display: flex;
	flex-direction: column;
}

.img-container {

}

.padding {
	padding: var(--spacing);
}

.fixed-height {
	height: var(--current-vh);
}

.min-height {
	min-height: var(--current-vh);
}

iframe {
	flex: 1 1 0;
	width: 100%;
	height: 100%;
	border: 0;
	transition: opacity 0.6s ease;
}

iframe.hover {
	opacity: 0.5;
}

iframe.hover:hover {
	opacity: 1;
}

.raw {
	overflow: auto;
	padding: var(--spacing);
	margin: 0;
	white-space: pre-wrap;
}

.column-container {
	display: flex;
	justify-content: center;
}

.column {
	max-width: var(--column-large-width);
	flex: 1 1 0;
}

.loader {
	position: absolute;
	width: 100%;
}

.verticalContent .loader {
	position: relative;
}
</style>