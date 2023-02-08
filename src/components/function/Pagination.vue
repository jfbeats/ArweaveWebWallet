<template>
	<div class="pagination no-select" style="">
		<div class="container">
			<TransitionsManager :fast="true">
				<Link class="nav no-select" :run="previous" :key="!!previous" :disabled="!previous">Previous</Link>
			</TransitionsManager>
			<PaginationDots :index="index" :elements="elements" @index="i => nav(i)"/>
			<TransitionsManager :fast="true">
				<Link class="nav no-select" :run="next" :key="!!next" :disabled="!next" style="text-align: right;">Next</Link>
			</TransitionsManager>
		</div>
	</div>
</template>



<script setup lang="ts">
import TransitionsManager from '@/components/visual/TransitionsManager.vue'
import PaginationDots from '@/components/atomic/PaginationDots.vue'
import Link from '@/components/function/Link.vue'
import { computed, ref } from 'vue'

const props = defineProps<{
	index: number
	elements: number
	width?: string
}>()
const emit = defineEmits<{
	(e: 'index', value: number): void
}>()

const timeout = ref(0)
const previous = computed(() => props.index !== 0 && (() => nav(props.index - 1)))
const next = computed(() => props.index < props.elements - 1 && (() => nav(props.index + 1)))
const nav = (i: number) => {
	if (timeout.value) { return }
	timeout.value = 1
	setTimeout(() => timeout.value = 0, 400)
	emit('index', i)
}
const width = computed(() => props.width || 'var(--column-width-small)')
</script>



<style scoped>
.pagination {
	display: flex;
	justify-content: center;
}

.container {
	display: flex;
	flex: 1 1 0;
	justify-content: space-between;
	align-items: center;
	max-width: v-bind(width);
	transition: max-width 0.1s ease;
}

.nav {
	width: 7em;
	padding: var(--spacing);
	opacity: 0;
	flex: 1 1 0;
}

.nav:not(:disabled) {
	opacity: 1;
}
</style>