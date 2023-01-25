<template>
	<div class="pagination-dots">
		<Link v-for="i in elements" class="dot-container" :class="{ active: active(i - 1), hidden: hidden(i - 1), mid: mid(i - 1) }" :run="() => emit('index', i - 1)">
			<div class="dot" />
		</Link>
	</div>
</template>



<script setup lang="ts">
import Link from '@/components/function/Link.vue'

const props = defineProps<{
	index: number
	elements: number
}>()
const emit = defineEmits<{ (e: 'index', val: number): void }>()

const active = (i: number) => i === props.index
const hidden = (i: number) => {
	const threshold = 2
	const added = Math.max(threshold - props.index, 0) + Math.max(threshold - (props.elements - 1 - props.index), 0)
	const distance = Math.abs(i - props.index) > threshold + added
	return distance
}
const mid = (i: number) => Math.abs(i - props.index) === 1
</script>



<style scoped>
.pagination-dots {
	display: flex;
	align-items: center;
	justify-content: center;
	--base-width: 7.5px;
}

.dot-container {
	padding: 1em calc(var(--spacing) / 3);
	transition: 0.2s ease;
}

.dot-container.hidden {
	/*width: 0;*/
	/*height: 0;*/
	padding: 0;
	/*opacity: 0;*/
}

.dot {
	box-sizing: content-box;
	width: var(--base-width);
	height: var(--base-width);
	border-radius: var(--base-width);
	outline: 1.5px solid #fff;
	opacity: 0.8;
	transition: width 0.2s ease, height 0.2s ease, outline 0.2s ease, opacity 0.2s ease, background 2s cubic-bezier(0,-3,0,1);
}



.dot-container.active > .dot {
	background: #ffffff33;
	width: calc(var(--base-width) * 3);
	transition: width 0.2s ease, height 0.2s ease, outline 0.2s ease, opacity 0.2s ease, background 2s cubic-bezier(0,4,0,1);
}

.dot-container.mid > .dot {
}

.dot-container.hidden > .dot {
	width: 0;
	height: 0;
	outline: 1.5px solid transparent;
	transition: width 0.2s ease, height 0.2s ease, outline 0.2s ease, opacity 0.2s ease, background 2s cubic-bezier(0,-3,0,1);
}
</style>