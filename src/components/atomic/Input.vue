<template>
	<div class="input input-box" :class="{ focus }">
		<Icon :icon="icon" />
		<input class="text" v-model="model" :placeholder="placeholder" :autocomplete="autocomplete || 'off'" @focus="focus = true" @blur="focus = false">
		<Icon v-for="action in actions" :key="action.icon" :icon="action.icon" @click="action.function" />
	</div>
</template>



<script>
import Icon from '@/components/atomic/Icon.vue'
import { computed, ref, watch } from 'vue'

export default {
	components: { Icon },
	props: ['modelValue', 'icon', 'placeholder', 'actions', 'autocomplete', 'mask'],
	setup (props, { emit }) {
		const model = computed({
			get () { return props.modelValue },
			set (value) { emit('update:modelValue', value) }
		})
		const focus = ref(false)
		watch(() => model.value, (newVal, oldVal) => {
			if (!props.mask(newVal)) { model.value = oldVal }
		})
		return { model, focus }
	}
}
</script>



<style scoped>
.input {
	height: 3.5em;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: 0.3s ease;
}

.icon {
	opacity: var(--element-secondary-opacity);
}

.focus .icon {
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