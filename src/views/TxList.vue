<template>
	<div class="tx-list flex-column">
		<Tabs queryName="view" :tabs="wallet.queries" />
		<TransitionsManager :vector="transitionFactor" axis="x">
			<List :key="selectedQuery" :query="currentQuery.query" :component="TxCard" :componentProps="{ options: { currentAddress: wallet.key } }" card="true" />
		</TransitionsManager>
	</div>
</template>



<script setup lang="ts">
import TxCard from '@/components/composed/TxCard.vue'
import Tabs from '@/components/atomic/Tabs.vue'
import TransitionsManager from '@/components/visual/TransitionsManager.vue'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import List from '@/components/layout/List.vue'

const props = defineProps<{ wallet: Account }>()

const route = useRoute()
const selectedQuery = computed(() => (route.query.view || props.wallet.queries[0].name.toLowerCase()))
const currentQuery = computed(() => props.wallet.queries.find(q => q.name.toLowerCase() === selectedQuery.value) || props.wallet.queries[0])
const transitionFactor = ref(undefined as undefined | number)
watch(() => selectedQuery.value, (state, prevState) => {
	const toIndex = props.wallet.queries.findIndex(el => el.name.toLowerCase() === state)
	const fromIndex = props.wallet.queries.findIndex(el => el.name.toLowerCase() === prevState)
	transitionFactor.value = toIndex - fromIndex
})
</script>



<style scoped>
.tabs {
	z-index: 1;
}
</style>
