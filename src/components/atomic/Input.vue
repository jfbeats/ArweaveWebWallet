<template>
	<div class="input" :class="{ focus }">
		<div class="icon-container">
			<div class="icon-background">
				<img class="icon no-select" :src="icon" draggable="false">
			</div>
		</div>
		<input class="text" v-model="model" v-bind="$attrs" :placeholder="placeholder" :autocomplete="autocomplete || 'off'" @focus="focus = true" @blur="focus = false">
		<div v-for="action in actions" class="icon-container" @click="action.function" :key="action.icon">
			<div class="icon-background">
				<img class="icon no-select" :src="icon" draggable="false">
			</div>
		</div>
	</div>
</template>



<script>
import { computed, ref } from 'vue'

export default {
	inheritAttrs: false,
	props: ['modelValue', 'icon', 'placeholder', 'actions', 'autocomplete'],
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
	display: flex;
	border: 1px solid #ffffff24;
	border-radius: var(--border-radius);
	align-items: center;
	justify-content: center;
	background: #ffffff06;
	transition: 0.3s ease;
}

.input.focus {
	border: 1px solid #ffffff88;
	background: #ffffff08;
	box-shadow: 0 0 10px 0 #ffffff11;
}

.icon-container {
	flex: 0 0 auto;
	height: 3em;
	width: 3em;
	border-radius: inherit;
	padding: 3px;
}

.icon-background {
	width: 100%;
	height: 100%;
	/* background: var(--background2); */
	border-radius: inherit;
	display: flex;
	align-items: center;
	justify-content: center;
}

.icon {
	width: 1.4em;
	height: 1.4em;
	object-fit: contain;
	opacity: var(--element-secondary-opacity);
	transition: 0.3s ease;
}

.focus .icon {
	opacity: 1;
}

.text {
	font-size: 1em;
	padding: 0 var(--spacing);
	outline: none;
	border: none;
	flex: 1 1 auto;
	height: 4em;
	background-color: transparent;
	color: var(--element-secondary);
	width: 100%;
}
</style>