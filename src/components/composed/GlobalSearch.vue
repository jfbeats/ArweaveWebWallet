<template>
	<div class="global-search">
		<div class="input-container">
			<Input v-model="search" :actions="[searchAction]" placeholder="Search - address, transaction id, username, app name" style="flex:1 1 0;" />
		</div>
		<TransitionsManager>
			<div v-if="search.length" class="results input-box">
				<div class="query-list input-box flex-column">
					<div v-if="wallet" class="flex-column">
						<div class="secondary-text">User</div>
						<ProfileCard :wallet="wallet" compact="true" />
						<div />
					</div>
					<div class="secondary-text">Transactions</div>
					<List :query="topQuery" :component="TxCard" :component-props="{ options: { currentAddress: wallet?.key } }" />
				</div>
			</div>
		</TransitionsManager>
	</div>
</template>



<script setup lang="ts">
import Input from '@/components/form/Input.vue'
import List from '@/components/layout/List.vue'
import IconSearch from '@/assets/icons/search.svg?component'
import { computed } from 'vue'
import { arweaveQuery, queryAggregator } from '@/store/ArweaveStore'
import TxCard from '@/components/composed/TxCard.vue'
import TransitionsManager from '@/components/visual/TransitionsManager.vue'
import ProfileCard from '@/components/composed/ProfileCard.vue'
import { ArweaveAccount } from '@/providers/Arweave'
import { getAccountByAddress } from '@/functions/Wallets'
import { useDebouncedRef } from '@/functions/UtilsVue'

const search = useDebouncedRef('', 1000)
const isId = computed(() => ArweaveAccount.metadata.isAddress(search.value))
const searchAction = { run: () => {}, icon: IconSearch }

const wallet = computed(() => isId.value && userTxQuery?.state?.value?.length && getAccountByAddress(search.value))

const userTxQuery = queryAggregator([
	arweaveQuery(computed(() => isId.value ? { owners: [search.value] } : undefined), 'global search user'),
	arweaveQuery(computed(() => isId.value ? { recipients: [search.value] } : undefined), 'global search user'),
])

const nameQuery = queryAggregator([
	arweaveQuery(computed(() => !isId.value ? { tags: [{ name: 'App-Name', values: ['arweave-id'] }, { name: 'Name', values: [search.value] }] } : undefined)),
	arweaveQuery(computed(() => !isId.value ? { tags: [{ name: 'App-Name', values: [search.value] }] } : undefined)),
	arweaveQuery(computed(() => !isId.value && search.value.toLowerCase() !== search.value ? { tags: [{ name: 'App-Name', values: [search.value.toLowerCase()] }] } : undefined)),
])

const topQuery = queryAggregator([
	arweaveQuery(computed(() => isId.value ? { ids: [search.value] } : undefined)),
	userTxQuery,
	nameQuery,
])
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
	max-height: calc(var(--current-vh) * 0.8);
	overflow: hidden;
	z-index: 1;
}

.query-list {
	border: 0;
	border-radius: 0;
	padding: var(--spacing);
	max-height: calc(var(--current-vh) * 0.8);
	overflow: auto;
}

.result {
}
</style>