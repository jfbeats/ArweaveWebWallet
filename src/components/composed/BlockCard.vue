<template>
	<ListContainer class="block-card">
		<template #header>
			<Observer @intersection="visible = true" :threshold="0.5">
				<div class="flex-row" style="align-items: center; justify-content: space-between; flex-wrap: wrap;">
					<h2 class="flex-row" style="align-items: center;">
						<Icon :icon="ICON.cube" style="font-size: 1.5em; color: var(--orange);" />
						<span>Block {{ block.node.height }}</span>
					</h2>
					<TransitionsManager>
						<div v-if="blockData" style="text-align: end; flex: 1 1 auto;">
							<div>{{ blockData.txs?.length }} Transactions | {{ humanFileSize(blockData.block_size) }}</div>
							<div><Date :timestamp="blockData.timestamp * 1000" /></div>
						</div>
					</TransitionsManager>
				</div>
			</Observer>
		</template>
		<template #default>
			<div v-if="visible" class="container-scroll">
				<List :query="txsQuery" :component="TxCard" :componentProps="{ options: { space: true } }" />
			</div>
		</template>
	</ListContainer>
</template>



<script setup lang="ts">
import ListContainer from '@/components/layout/ListContainer.vue'
import Date from '@/components/atomic/Date.vue'
import TransitionsManager from '@/components/visual/TransitionsManager.vue'
import Icon from '@/components/atomic/Icon.vue'
import TxCard from '@/components/composed/TxCard.vue'
import List from '@/components/layout/List.vue'
import Observer from '@/components/function/Observer.vue'
import { ICON } from '@/store/Theme'
import { ref } from 'vue'
import { arweave, arweaveQuery } from '@/store/ArweaveStore'
import { humanFileSize } from '@/functions/Utils'
import { getAsyncData } from '@/functions/AsyncData'

const props = defineProps<{ block: any }>()

const visible = ref(false)
const txsQuery = arweaveQuery({ block: { min: props.block.node.height, max: props.block.node.height } })
const blockData = getAsyncData({
	name: 'single block header',
	awaitEffect: () => visible.value,
	query: async () => arweave.blocks.get(props.block.node.id),
	seconds: 10,
	completed: state => state
}).state
</script>



<style scoped>
.container-scroll {
	height: 100%;
	overflow: hidden auto;
}

.list {
	padding: var(--spacing);
}
</style>