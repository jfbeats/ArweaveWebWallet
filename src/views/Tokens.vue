<template>
	<div>
		<div v-for="contract in contracts" :key="contract.id">
			<TokenCard :txId="contract.id" :wallet="wallet" class="card" />
		</div>
	</div>
</template>

<script setup lang="ts">
import TokenCard from '@/components/composed/TokenCard.vue'
import SmartweaveStore from '@/store/SmartweaveStore'

const props = defineProps<{ wallet: Wallet }>()

const contracts = [
	{ name: 'AO', id: '0syT13r0s0tgPmIed95bJnuSqaD29HQNN8D3ElLSrsc' },
	{ name: 'ARIO', id: 'qNvAoz0TgcH7DMg8BCVn8jF32QH5L6T29VjHxhHqqGE' }
]
</script>

<style scoped>
</style>