<template>
	<div>
		<div v-for="(value, key) in SmartweaveStore.contracts" :key="key">
			<TokenCard :txId="key" :wallet="wallet" class="card" />
		</div>
	</div>
</template>

<script>
import TokenCard from '@/components/composed/TokenCard.vue'
import SmartweaveStore from '@/store/SmartweaveStore'

export default {
	components: { TokenCard },
	props: ['wallet'],
	setup () {
		return { SmartweaveStore }
	}
}
</script>

<style scoped>
</style>