<template>
	<TransitionsManager>
		<div v-if="data.handler === 'intent'" @click="data.intent = true" class="selector data-container min-height box" style="display: flex; justify-content: center; padding-top: 5em;">
			<Button :icon="ICON.download">Load large file</Button>
		</div>
		<div v-else-if="data.handler === 'raw'" key="json" class="selector data-container min-height box">
			<TransitionsManager>
				<LoaderBlock v-if="!data.loaded && !data.error" class="loader" />
				<pre v-else class="raw">{{ data.payload }}</pre>
			</TransitionsManager>
		</div>
		<div v-else-if="data.handler" class="selector">
			<TransitionsManager>
				<LoaderBlock v-if="!data.loaded && !data.error" class="loader" />
			</TransitionsManager>
			<TransitionsManager>
				<div v-show="data.loaded" v-bind="data.handler.containerAttrs" class="box">
					<component :is="data.handler.is" v-bind="data.handler.attrs" @load="data.loaded = true" @error="data.error = true; notify.error('Failed to load')" />
				</div>
			</TransitionsManager>
		</div>
	</TransitionsManager>
</template>



<script setup lang="ts">
import Img from '@/components/handlers/Img.vue'
import Video from '@/components/handlers/Video.vue'
import Button from '@/components/atomic/Button.vue'
import List from '@/components/layout/List.vue'
import TxCard from '@/components/composed/TxCard.vue'
import LoaderBlock from '@/components/layout/LoaderBlock.vue'
import TransitionsManager from '@/components/visual/TransitionsManager.vue'
import { notify } from '@/store/NotificationStore'
import { ICON } from '@/store/Theme'
import ArweaveStore, { arweave, arweaveQuery, getData } from '@/store/ArweaveStore'
import { unpackTags } from '@/functions/Transactions'
import { computed, markRaw, reactive, ref, watch } from 'vue'

type Handler = {
	is: string | object
	attrs?: object
	containerAttrs?: object
}

const props = defineProps(['tx'])

const gatewayLink = computed(() => ArweaveStore.gatewayURL + props.tx.id)
const smartweaveLink = computed(() => 'https://arcode.studio/#/' + props.tx.id + '?theme=dark-blue&hideToolbar=true')

const data = reactive({
	handler: undefined as undefined | Handler | 'intent' | 'raw',
	payload: undefined as any,
	loaded: false,
	error: false,
	intent: false,
})
const rawWhiteSpace = ref(undefined as undefined | string)

watch(() => props.tx.id, () => {
	data.handler = undefined
	data.payload = undefined
	data.loaded = false
	data.error = false
	data.intent = false
	rawWhiteSpace.value = 'pre-wrap'
	load()
}, { immediate: true })
watch(() => data.intent, () => data.intent && load())

async function load () {
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
	else if (tags['Content-Type'] === 'application/x.arweave-manifest+json' || tags['Content-Type'] === 'text/html' || tags['Content-Type'] === 'application/pdf') { return data.handler = { is: 'iframe', attrs: { src: gatewayLink.value, class: ['hover'] }, containerAttrs: { class: ['iframe-container', 'fixed-height'] } } }
	else if (tags['Content-Type']?.split('/')[0] === 'video') { data.loaded = true; return data.handler = { is: markRaw(Video), attrs: { tx: props.tx }, containerAttrs: { class: ['iframe-container'] } } }
	else if (tags['Content-Type']?.split('/')[0] === 'audio') { data.loaded = true; return data.handler = { is: markRaw(Video), attrs: { tx: props.tx }, containerAttrs: { class: ['iframe-container'] } } }
	// else if (tags['Content-Type']?.split('/')[0] === 'audio') { return data.handler = { is: 'iframe', attrs: { src: gatewayLink.value }, containerAttrs: { class: ['iframe-container', 'fixed-height'] } } }
	else if (props.tx.data.size > 104857600 && !data.intent) { return data.handler = 'intent' }
	else if (tags['Content-Type']?.split('/')[0] === 'image') { return data.handler = { is: markRaw(Img), attrs: { src: gatewayLink.value }, containerAttrs: { class: ['img-container'] } } }
	else if (tags['App-Name'] === 'SmartWeaveContract' || tags['App-Name'] === 'SmartWeaveContractSource') { return data.handler = { is: 'iframe', attrs: { src: smartweaveLink.value }, containerAttrs: { class: ['iframe-container', 'fixed-height'] } } }
	else {
		data.handler = 'raw'
		try { if (tags['Content-Type'] === 'application/gzip') { data.payload ??= await gzipDecompress(props.tx.id) } } catch (e) { console.error(e) }
		data.payload ??= await getData(props.tx.id).catch(() => undefined)
		if (data.payload?.[0] === '{' || data.payload?.[0] === '[') { try { data.payload = JSON.stringify(JSON.parse(data.payload), null, 2); rawWhiteSpace.value = 'pre' } catch (e) { } }
		data.loaded = true
		// todo implement retries
	}
}

async function gzipDecompress(tx: string) {
	let res: any
	try { res ??= (await arweave.api.get(tx, {responseType: 'blob'})).data } catch (e) { }
	try { res ??= new Blob([await arweave.transactions.getData(tx, { decode: true })]) } catch (e) { }
	const ds = new DecompressionStream('gzip')
	const decompressedStream = res.stream().pipeThrough(ds)
	const blob = await new Response(decompressedStream).blob()
	return blob.text()
}
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
	font-family: inherit;
	overflow: auto;
	padding: var(--spacing);
	margin: 0;
	white-space: v-bind(rawWhiteSpace);
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