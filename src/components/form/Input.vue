<template>
	<div class="input">
		<div class="input-box" :class="{ focus }">
			<IconVue v-if="icon" :icon="icon" />
			<RawInput class="text" v-model="model" @keyup.enter="runSubmit" :placeholder="placeholder" @focus="focus = true" @blur="focus = false" v-bind="$attrs" />
			<ActionsRow :actions="actions" />
		</div>
	</div>
</template>



<script setup lang="ts">
import IconVue from '@/components/atomic/Icon.vue'
import RawInput from '@/components/form/RawInput.vue'
import ActionsRow from '@/components/atomic/ActionsRow.vue'
import { createAction } from '@/functions/UtilsVue'
import { computed, ref, watch } from 'vue'

const props = defineProps<{
	modelValue: string
	icon?: Icon
	placeholder?: string
	actions?: Action[]
	submit?: Action
	autocomplete?: string
	mask?: (val: string) => boolean
}>()
const emit = defineEmits(['update:modelValue'])

const model = computed({
	get () { return props.modelValue },
	set (value) { emit('update:modelValue', value) }
})
const actions = computed(() => [...(props.actions || []), ...(props.submit ? [props.submit] : [])])
const focus = ref(false)
watch(() => model.value, (newVal, oldVal) => {
	if (!props.mask) { return }
	if (!props.mask(newVal)) { model.value = oldVal }
})

const { runFunctions } = createAction(computed(() => props.submit))
const runSubmit = (e: KeyboardEvent) => { runFunctions.value?.(e as any) }
</script>



<script lang="ts">
export default {
	inheritAttrs: false,
	methods: {
		getScopeAttrs () {
			const scopeAttr = (this as any).$parent.$options.__scopeId
			return scopeAttr ? { [scopeAttr]: '' } : {}
		}
	}
}
</script>



<style scoped>
.input {
	height: 3.5em;
	background: transparent;
	border-radius: var(--border-radius);
}

.input-box {
	display: flex;
	align-items: center;
	justify-content: center;
	flex: 1 1 0;
	height: 100%;
	width: 100%;
	border-radius: inherit;
}

.icon {
	font-size: 1.4em;
	width: 2em;
	opacity: var(--element-secondary-opacity);
}

.actions-row {
	height: 100%;
	font-size: 1.4em;
	opacity: var(--element-secondary-opacity);
	transition: 0.3s ease;
}

.focus .icon,
.focus .actions-row {
	opacity: 1;
}

.text {
	height: inherit;
	font-size: 1em;
	padding: 0 var(--spacing);
	outline: none;
	border: none;
	flex: 1 1 auto;
	background-color: transparent;
	color: var(--element-secondary);
	width: 100%;
}
</style>