<template>
	<button type="button" class="expand" @click="expanded = !expanded">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" :class="{ expanded }">
			<path d="M24 24H0V0h24v24z" fill="none" opacity=".87" />
			<path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6-1.41-1.41z" />
		</svg>
	</button>
</template>



<script setup>
import { computed } from 'vue'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const expanded = computed({
	get () { return props.modelValue },
	set (value) { emit('update:modelValue', value) }
})
</script>



<style scoped>
.expand {
	cursor: pointer;
	width: 1.5em;
	height: 1.5em;
	display: flex;
}

svg {
	width: 100%;
	height: 100%;
	transition: 0.2s ease;
}

svg.expanded {
	transform: rotate(180deg);
}
</style>