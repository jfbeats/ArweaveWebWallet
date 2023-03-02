<template>
	<div class="tx-list flex-column">
		<Tabs v-model="queryName" :tabs="wallet.queries" />
		<TransitionsManager :vector="transitionFactor" axis="x">
			<List :key="currentQuery.name" :query="currentQuery.query" :component="TxCard" :componentProps="{ options: { currentAddress: wallet.key } }" card="true" />
		</TransitionsManager>
	</div>
</template>



<script setup lang="ts">
import TxCard from '@/components/composed/TxCard.vue'
import Tabs from '@/components/atomic/Tabs.vue'
import TransitionsManager from '@/components/visual/TransitionsManager.vue'
import { computed, ref } from 'vue'
import List from '@/components/layout/List.vue'
import { useRoute, useRouter } from '@/router'

const props = defineProps<{ wallet: Account }>()
const route = useRoute()
const router = useRouter()

const queryName = computed<string>({
	get: () => Array.isArray(route.params.queryName) ? route.params.queryName[0] : route.params.queryName
			|| props.wallet.queries[0].name.toLowerCase(),
	set: value => {
		const toIndex = props.wallet.queries.findIndex(el => el.name.toLowerCase() === value.toLowerCase())
		const fromIndex = props.wallet.queries.findIndex(el => el.name.toLowerCase() === queryName.value.toLowerCase())
		transitionFactor.value = toIndex - fromIndex
		router.replace({ params: { queryName: value.toLowerCase() } })
	}
})
const currentQuery = computed(() => props.wallet.queries.find(q => q.name.toLowerCase() === queryName.value) || props.wallet.queries[0])
const transitionFactor = ref(undefined as undefined | number)
</script>



<style scoped>
.tabs {
	z-index: 1;
}
</style>
