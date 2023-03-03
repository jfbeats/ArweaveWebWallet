<template>
	<video ref="vidRef" v-bind="bind" loop v-show="loaded">
		<source :src="ArweaveStore.gatewayURL + tx.id" :type="tags['content-type']">
		<Button v-if="!thumbnail" :to="ArweaveStore.gatewayURL + tx.id" />
	</video>
</template>



<script setup lang="ts">
import ArweaveStore from '@/store/ArweaveStore'
import { computed, ref, watch } from 'vue'
import { unpackTags } from '@/functions/Transactions'
import Button from '@/components/atomic/Button.vue'

const props = defineProps<{ tx: AnyTransaction, thumbnail?: true }>()

const tags = computed(() => unpackTags(props.tx.tags, { lowercase: true }))
const loaded = ref(false)
const vidRef = ref(undefined as undefined | HTMLVideoElement)
const loadedData = () => (vidRef.value?.readyState || 0) >= (bind.value.autoplay ? 3 : 2) && (loaded.value = true)
const largeFile = computed(() => {
	const size = !ArrayBuffer.isView(props.tx.data) && props.tx.data.size
	return size && parseInt(size) > 50 * 1024 * 1024
})
const bind = computed(() => {
	if (largeFile.value && props.thumbnail) { return {
		preload: 'metadata',
		onLoadedmetadata: () => loadedData(),
	} }
	return {
		controls: !props.thumbnail,
		muted: props.thumbnail,
		autoplay: props.thumbnail,
		onLoadeddata: () => loadedData(),
	}
})
watch(() => props.tx?.id, (val, oldVal) => val !== oldVal && (loaded.value = false))
// todo always pause when off screen
</script>



<style scoped>
video {
	max-height: var(--current-vh);
	background: #000;
}
</style>