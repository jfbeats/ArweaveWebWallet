<template>
	<div class="global-search">
		<div class="input-container">
			<Input v-model="search" :actions="[searchAction]" placeholder="Search - username, address, transaction id" style="flex:1 1 0;" />
		</div>
		<TransitionsManager>
			<div v-if="data.query?.length" class="results input-box">
				<List class="query-list input-box">
					<List v-if="wallet" class="flex-column">
						<div class="secondary-text">User</div>
						<ProfileCard :wallet="wallet" compact="true" />
						<div />
					</List>
					<div class="secondary-text">Transactions</div>
					<div v-for="item in data.query" :key="item" class="result">
						<TxCard :tx="item.node" :current-address="wallet?.key"></TxCard>
					</div>
				</List>
			</div>
		</TransitionsManager>
	</div>
</template>



<script setup lang="ts">
import Input from '@/components/atomic/Input.vue'
import List from '@/components/layout/List.vue'
import IconSearch from '@/assets/icons/search.svg?component'
import { computed, reactive, ref, watch } from 'vue'
import { arweaveQuery, queryAggregator } from '@/store/ArweaveStore'
import TxCard from '@/components/composed/TxCard.vue'
import TransitionsManager from '@/components/visual/TransitionsManager.vue'
import ProfileCard from '@/components/composed/ProfileCard.vue'
import { getAccountByAddress } from '@/functions/Wallets'
import { useDebouncedRef } from '@/functions/UtilsVue'


const search = useDebouncedRef('')
const isId = computed(() => search.value.match(/^[a-z0-9_-]{43}$/i))
const searchAction = { run: () => {}, icon: IconSearch }

let query: any
const data = ref({} as any)
const wallet = computed(() => isId.value && !data.value.idQuery?.state?.length && getAccountByAddress(search.value))

watch(search, () => {
	query = undefined
	data.value = {}
	if (isId.value) {
		const idQuery = arweaveQuery({ ids: [search.value] })
		data.value.idQuery = idQuery
		query = queryAggregator([
			idQuery,
			arweaveQuery({ owners: [search.value] }),
			arweaveQuery({ recipients: [search.value] }),
		])
	}
	else if (search.value.length) { query = queryAggregator([
		arweaveQuery({ tags: [{ name: 'App-Name', values: ['arweave-id'] }, { name: 'Name', values: [search.value] }] }),
	])}
	data.value.query = query?.state
	query?.fetchQuery.query()
})
</script>



<style scoped>
.global-search {
	position: relative;
}

.input-container {
	background: var(--background2);
	border-radius: var(--border-radius);
	position: relative;
	z-index: 2;
}

.results {
	top: calc(100% - var(--border-radius));
	background: var(--background2);
	border-top-left-radius: 0;
	border-top-right-radius: 0;
	position: absolute;
	width: 100%;
	overflow: hidden;
	z-index: 1;
}

.query-list {
	border: 0;
	border-radius: 0;
	padding: var(--spacing);
	/*padding-top: var(--border-radius);*/
}

.result {
}
</style>