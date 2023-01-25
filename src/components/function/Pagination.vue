<template>
	<div class="nav-container no-select" style="justify-content: space-between; align-items: center;">
		<TransitionsManager :fast="true">
			<Link class="nav no-select" :run="previous" :key="!!previous" :class="{ active: previous }">Previous</Link>
		</TransitionsManager>
		<PaginationDots :index="index" :elements="elements" @index="i => nav(i)"/>
		<TransitionsManager :fast="true">
			<Link class="nav no-select" :run="next" :key="!!next" :class="{ active: next }" style="text-align: right;">Next</Link>
		</TransitionsManager>
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
</script>



<style scoped>
.nav-container {
	display: flex;
}

.nav {
	width: 7em;
	padding: var(--spacing);
	opacity: 0;
}

.nav.active {
	opacity: 1;
}
</style>