<template>
	<div class="tabs">
		<button type="button" class="tab" v-for="tab in tabs" :key="tab.name" :style="{ '--color': tab.color }" :class="{ active: model?.toLowerCase() === tab.name.toLowerCase() }" @click="model = tab.name" :disabled="disabled">{{ tab.name }}</button>
	</div>
</template>



<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
	tabs: { name: string, color: string }[]
	modelValue: string
	disabled?: boolean
}>()
const emit = defineEmits(['update:modelValue'])

const model = computed<string>({
	get () { return props.modelValue },
	set (value) { emit('update:modelValue', value) }
})
</script>



<style scoped>
.tabs {
	display: flex;
	align-items: center;
	justify-content: space-evenly;
}

.tab {
	padding: 0.2em 0;
	flex: 1 1 0;
	text-align: center;
	cursor: pointer;
	user-select: none;
	text-decoration: none;
	transition: color 0.2s ease, opacity 0.2s ease;
	opacity: var(--element-disabled-opacity);
	color: inherit;
	position: relative;
}

.tab:hover {
	opacity: 1;
}

.tab:disabled {
	opacity: var(--element-disabled-opacity);
	cursor: unset;
}

.tab.active {
	opacity: 1;
	color: var(--color);
}

.tab::before {
	content: "";
	background: var(--color);
	width: 12px;
	height: 2px;
	border-radius: 1px;
	position: absolute;
	margin: auto;
	left: 0;
	right: 0;
	bottom: 0;
	opacity: 0.5;
	transition: width 0.2s ease;
}

.tab.active::before {
	width: 100%;
	height: 2px;
	background: var(--color);
}
</style>