<template>
	<div class="select input-box" :class="{ focus }">
		<Icon v-if="currentIcon" :icon="currentIcon" style="left:0;" />
		<select class="text" v-model="model" :placeholder="placeholder" @focus="focus = true" @blur="focus = false" :class="{ hasPadding: currentIcon }">
			<option class="text-option" v-for="option in options" :key="option" :value="option.value">{{ option.text }}</option>
		</select>
		<Icon :icon="'⥥'" style="right:0;" />
	</div>
</template>



<script setup lang="ts">
import Icon from '@/components/atomic/Icon.vue'
import { computed, ref } from 'vue'

const props = defineProps<{
	modelValue?: any
	options?: { value?: any, text?: string, icon?: any }[]
	icon?: any
	placeholder?: string
}>()
const emit = defineEmits(['update:modelValue'])

const model = computed({
	get () { return props.modelValue },
	set (value) { emit('update:modelValue', value) }
})
const focus = ref(false)
const currentIcon = computed(() => props.icon || props.options?.find(op => op.value === model.value)?.icon)
</script>



<style scoped>
.select {
	height: 3.5em;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
}

.icon {
	font-size: 1.4em;
	width: 2em;
	position: absolute;
	opacity: var(--element-secondary-opacity);
	pointer-events: none;
	touch-action: none;
}

.focus .icon {
	opacity: 1;
}

.text {
	appearance: none;
	height: inherit;
	font-size: 1em;
	padding: 0 calc(var(--spacing) + 3em) 0 calc(var(--spacing));
	outline: none;
	border: none;
	flex: 1 1 auto;
	background-color: transparent;
	color: var(--element-secondary);
	width: 100%;
}

.text.hasPadding {
	padding: 0 calc(var(--spacing) + 3em) 0 calc(var(--spacing) + 3em);
}

.text-option {
	background-color: var(--background3);
	color: var(--element-secondary);
}
</style>