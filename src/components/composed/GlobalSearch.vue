<template>
	<div class="global-search">
		<div class="input-container flex-row">
			<Input v-model="search" :actions="[searchAction]" placeholder="Search - address, transaction id, username, app, tag" />
			<Input v-model="subSearch" v-if="search && !isId" :icon="ICON.label" placeholder="Tag value" />
		</div>
		<TransitionsManager axis="y" :vector="vector">
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
import { ICON } from '@/store/Theme'
import { computed, ref, watch } from 'vue'
import { arweaveQuery, queryAggregator } from '@/store/ArweaveStore'
import TxCard from '@/components/composed/TxCard.vue'
import TransitionsManager from '@/components/visual/TransitionsManager.vue'
import ProfileCard from '@/components/composed/ProfileCard.vue'
import { ArweaveAccount } from '@/providers/Arweave'
import { getAccountByAddress } from '@/functions/Wallets'
import { useDebouncedRef } from '@/functions/UtilsVue'

const search = useDebouncedRef('', 1000)
const subSearch = useDebouncedRef('', 1000)
const isId = computed(() => ArweaveAccount.metadata.isAddress(search.value))
const searchAction = computed(() => ({ run: () => {}, icon: !subSearch.value.length && ICON.search, disabled: true }) as Action)

const wallet = computed(() => isId.value && userTxQuery?.state?.value?.length && getAccountByAddress(search.value))
const getUserTxQuery = () => [
	arweaveQuery(computed(() => ({ owners: [search.value] })), 'global search user'),
	arweaveQuery(computed(() => ({ recipients: [search.value] })), 'global search user'),
]
const getIdTxQuery = () => [
	arweaveQuery(computed(() => ({ ids: [search.value] })), 'global search id'),
]
const getNameTxQuery = () => subSearch.value ? [
	arweaveQuery(computed(() => ({ tags: [{ name: search.value, values: [subSearch.value] }] }))),
] : [
	// todo arweaveQuery(computed(() => search.value.split('/').length === 2 ? { tags: [{ name: 'Content-Type', values: [search.value.toLowerCase()] }] } : undefined)),
	arweaveQuery(computed(() => ({ tags: [{ name: 'App-Name', values: ['arweave-id'] }, { name: 'Name', values: [search.value] }] }))),
	// todo other profile providers
	arweaveQuery(computed(() => ({ tags: [{ name: 'App-Name', values: [search.value] }] }))),
	arweaveQuery(computed(() => search.value.toLowerCase() !== search.value ? { tags: [{ name: 'App-Name', values: [search.value.toLowerCase()] }] } : undefined)),
	arweaveQuery(computed(() => ({ tags: [{ name: 'app', values: [search.value] }] }))),
	arweaveQuery(computed(() => search.value.toLowerCase() !== search.value ? { tags: [{ name: 'app', values: [search.value.toLowerCase()] }] } : undefined)),
]
const userTxRef = ref([] as ReturnType<typeof getUserTxQuery>)
const userTxQuery = queryAggregator(userTxRef)
const idTxRef = ref([] as ReturnType<typeof getIdTxQuery>)
const idTxQuery = queryAggregator(idTxRef)
const nameRef = ref([] as ReturnType<typeof getNameTxQuery>)
const nameQuery = queryAggregator(nameRef)
watch(() => [search.value, subSearch.value] as const, (val, old) => {
	if (!val[0] && old?.[0]) { subSearch.value = '' }
	if (isId.value) {
		if (userTxRef.value.length === 0) { userTxRef.value = getUserTxQuery() }
		if (idTxRef.value.length === 0) { idTxRef.value = getIdTxQuery() }
		nameRef.value = []
	} else {
		userTxRef.value = []
		idTxRef.value = []
		if (nameRef.value.length === 0 || !!val[1] !== !!old?.[1]) { nameRef.value = getNameTxQuery() }
	}
}, { immediate: true })
const topQuery = queryAggregator([idTxQuery, userTxQuery, nameQuery])
const vector = ref(0)
watch(search, val => vector.value = val.length > 0 ? 1 : -1, { immediate: true, flush: 'post' })
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
	gap: 0;
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

.input:first-child {
	flex: 2 1 100px;
}

.input:first-child:not(:only-child) {
	border-top-right-radius: 0;
	border-bottom-right-radius: 0;
}

.input:not(:first-child) {
	flex: 1 1 100px;
	border-top-left-radius: 0;
	border-bottom-left-radius: 0;
}
</style>