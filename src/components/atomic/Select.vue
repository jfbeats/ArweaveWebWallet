<template>
	<div class="input" :class="{ focus }">
		<Icon :icon="icon" style="left:0;" />
		<select class="text" v-model="model" :placeholder="placeholder" @focus="focus = true" @blur="focus = false">
			<option v-for="option in options" :key="option" :value="option.value">{{ option.text }}</option>
		</select>
		<Icon :icon="'⥥'" style="right:0;" />
	</div>
</template>



<script>
import Icon from '@/components/atomic/Icon.vue'
import { computed, ref } from 'vue'

export default {
	components: { Icon },
	props: ['modelValue', 'options', 'icon', 'placeholder'],
	setup (props, { emit }) {
		const model = computed({
			get () { return props.modelValue },
			set (value) { emit('update:modelValue', value) }
		})
		const focus = ref(false)
		return { model, focus }
	}
}
</script>



<style scoped>
.input {
	height: 3.5em;
	display: flex;
	border: 1px solid #ffffff24;
	border-radius: var(--border-radius);
	align-items: center;
	justify-content: center;
	background: #ffffff06;
	transition: 0.3s ease;
	position: relative;
}

.input.focus {
	border: 1px solid #ffffff88;
	background: #ffffff08;
	box-shadow: 0 0 10px 0 #ffffff11;
}

.icon {
	position: absolute;
	opacity: var(--element-secondary-opacity);
	pointer-events: none;
}

.focus .icon {
	opacity: 1;
}

.text {
	appearance: none;
	height: inherit;
	font-size: 1em;
	padding: 0 calc(var(--spacing) + 3em);
	outline: none;
	border: none;
	flex: 1 1 auto;
	background-color: transparent;
	color: var(--element-secondary);
	width: 100%;
}
</style>