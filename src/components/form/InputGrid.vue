<template>
	<div v-if="schema && schema.length > 0" class="input-grid input-box" :class="{ focus }">
		<div v-for="(row, index) in schema" :key="row.key" class="row">
			<div class="inputs">
				<div v-for="(input, inputIndex) in row.items" :key="row.key + input.name" class="input" :class="{ flip: row.items.length == 2 && inputIndex == 1 }">
					<Icon v-if="input.icon" :icon="input.icon" />
					<RawInput v-model="input.value" v-bind="input.attrs" class="text" :placeholder="input.name" @focus="focus = (index + 1) * (inputIndex + 1)" @blur="focus = 0" />
				</div>
			</div>
			<button v-if="row.deletable" class="remove" @click="removeRow(index)" type="button">
				<Icon :icon="ICON.x" />
			</button>
		</div>
	</div>
</template>



<script setup lang="ts">
import RawInput from '@/components/form/RawInput.vue'
import Icon from '@/components/atomic/Icon.vue'
import { ICON } from '@/store/Theme'
import { computed, ref } from 'vue'

const props = defineProps<{
	modelValue: TagSchema[]
	disabled?: boolean
}>()
const emit = defineEmits<{
	(e: 'update:modelValue', value: TagSchema[]): void
}>()

const schema = computed<TagSchema[]>({
	get () { return props.modelValue },
	set (value) { emit('update:modelValue', value) }
})

const focus = ref(0)
const removeRow = (index: number) => schema.value = schema.value.filter((_, i) => i !== index)
</script>



<style scoped>
.input-grid {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.row {
	width: 100%;
	display: flex;
}

.inputs {
	flex: 1 1 0;
	min-width: 0;
	display: flex;
}

.vertical .inputs {
	flex-direction: column;
}

.input {
	flex: 1 1 auto;
	min-width: 0;
	height: inherit;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: inherit;
}

.icon {
	font-size: 1.4em;
	width: 2em;
	opacity: var(--element-secondary-opacity);
}

.focus .icon {
	opacity: 1;
}

.text {
	flex: 1 1 0;
	min-width: 0;
	width: 0;
	height: 3.5em;
	font-size: 1em;
	padding: 0 var(--spacing);
	outline: none;
	border: none;
	background-color: transparent;
	color: var(--element-secondary);
}

.input.flip {
	flex-direction: row-reverse;
}

.input.flip .text {
	text-align: end;
}

.input-grid:not(.vertical) .input:not(.flip):not(:first-child)::before {
	content: "";
	width: 1px;
	height: 1.2em;
	background: #ffffff18;
	transition: 0.3s ease;
}

.input-grid:not(.vertical).focus .input:not(.flip):not(:first-child)::before {
	background: #ffffff60;
}

.input-grid:not(.vertical) .input.flip::after {
	content: "";
	width: 1px;
	height: 1.2em;
	background: #ffffff18;
	transition: 0.3s ease;
}

.input-grid:not(.vertical).focus .input.flip::after {
	background: #ffffff60;
}

.vertical .text:first-child {
	margin-inline-start: 3em;
}

.remove {
	display: flex;
	align-items: center;
	opacity: 0.5;
	transition: 0.1s ease;
}

.remove:hover {
	opacity: 1;
}
</style>