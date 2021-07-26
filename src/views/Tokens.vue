<template>
	<div>
		<div v-for="(value, key) in SmartweaveStore.contracts" :key="key">{{ value }}</div>
	</div>
</template>

<script>
import SmartweaveStore from '@/store/SmartweaveStore'

export default {
	props: ['wallet'],
	setup () {
		return { SmartweaveStore }
	}
}
</script>

<style scoped>
</style>