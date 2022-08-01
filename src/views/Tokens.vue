<template>
	<div>
		<div v-for="(value, key) in SmartweaveStore.contracts" :key="key">
			<TokenCard :txId="key" :wallet="wallet" class="card" />
		</div>
	</div>
</template>

<script setup lang="ts">
import TokenCard from '@/components/composed/TokenCard.vue'
import SmartweaveStore from '@/store/SmartweaveStore'

const props = defineProps<{ wallet: Wallet }>()
</script>

<style scoped>
</style>