<template>
	<video controls>
		<source :src="ArweaveStore.gatewayURL + tx.id" :type="tags['Content-Type']">
		Not supported
	</video>
</template>



<script setup lang="ts">
import ArweaveStore from '@/store/ArweaveStore'
import { computed } from 'vue'
import { unpackTags } from '@/functions/Transactions'

const props = defineProps<{ tx: any }>()

const tags = computed(() => unpackTags(props.tx.tags))
</script>



<style scoped>
video {
	max-height: var(--current-vh);
	background: #000;
}
</style>