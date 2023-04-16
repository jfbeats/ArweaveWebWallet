<template>
	<ListContainer class="block-card">
		<template #header>
			<BlockCardHeader v-bind="props" />
		</template>
		<template #default>
			<div class="container-scroll">
				<Observer @intersecting="visible = true" />
				<List v-if="visible" :query="txsQuery" :component="TxCard" :componentProps="{ options: { space: true } }" />
			</div>
		</template>
	</ListContainer>
</template>



<script setup lang="ts">
import ListContainer from '@/components/layout/ListContainer.vue'
import TxCard from '@/components/composed/TxCard.vue'
import List from '@/components/layout/List.vue'
import { ref } from 'vue'
import { arweaveQuery } from '@/store/ArweaveStore'
import BlockCardHeader from '@/components/composed/BlockCardHeader.vue'
import Observer from '@/components/function/Observer.vue'

const props = defineProps<{
	block: any
	active?: boolean
}>()

const visible = ref(false)
const txsQuery = arweaveQuery({ block: { min: props.block.node.height, max: props.block.node.height } })
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