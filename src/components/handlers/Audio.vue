<template>
	<audio controls :src="ArweaveStore.gatewayURL + tx.id" :type="tags['Content-Type']" />
</template>



<script setup lang="ts">
import ArweaveStore from '@/store/ArweaveStore'
import { computed } from 'vue'
import { unpackTags } from '@/functions/Transactions'

const props = defineProps<{ tx: any }>()

const tags = computed(() => unpackTags(props.tx.tags))
</script>



<style scoped>
audio {
	max-height: var(--current-vh);
	width: 100%;
}
</style>