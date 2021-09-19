<template>
	<input class="slider input-box" type="range" min="0" max="1000" v-model="model">
</template>

<script>
import { computed } from 'vue'

export default {
	props: ['modelValue'],
	setup (props, { emit }) {
		const model = computed({
			get () { return props.modelValue },
			set (value) { emit('update:modelValue', value) }
		})
		return { model }
	}
}
</script>

<style scoped>
input[type="range"] {
	--height: 1.6em;
	--width-thumb: 0.5em;
	--color: var(--element-secondary);
	appearance: none;
	-webkit-appearance: none;
	margin: 0;
	padding: 0;
	height: var(--height);
	border-radius: var(--border-radius);
	overflow: hidden;
	cursor: pointer;
	display: flex;
}

/*webkit*/
input[type="range"]:focus::-webkit-slider-thumb {
	opacity: 1;
}

input[type="range"]::-webkit-slider-thumb {
	opacity: 0.2;
	appearance: none;
	-webkit-appearance: none;
	width: var(--width-thumb);
	height: var(--height);
	background: var(--color);
	border: none;
	border-radius: 0;
	box-shadow: none;
	margin: 0;
	transition: 0.3s ease;
}

input[type="range"]::-webkit-slider-runnable-track {
	height: var(--height);
	border-radius: var(--border-radius);
	box-shadow: none;
}

/*mozilla*/
input[type="range"]:focus::-moz-range-thumb {
	opacity: 1;
}

input[type="range"]::-moz-range-thumb {
	opacity: 0.2;
	width: var(--width-thumb);
	height: var(--height);
	background: var(--color);
	border: none;
	border-radius: 0;
	box-shadow: none;
	transition: 0.3s ease;
}

input[type="range"]::-moz-range-track {
	height: max(calc(var(--height) - 1px - 1px), 0px);
	border-radius: var(--border-radius);
	box-shadow: none;
}

/*ms*/
input[type="range"]::-ms-fill-upper {
	background: transparent;
	border-color: transparent;
}

input[type="range"]::-ms-fill-lower {
	background: transparent;
	border-color: transparent;
}

input[type="range"]:focus::-ms-thumb {
	opacity: 1;
}

input[type="range"]::-ms-thumb {
	opacity: 0.2;
	width: var(--width-thumb);
	height: var(--height);
	background: var(--color);
	border: none;
	border-radius: 0;
	box-shadow: none;
	margin-top: 0;
	box-sizing: border-box;
	transition: 0.3s ease;
}

input[type="range"]::-ms-track {
	height: var(--height);
	border-radius: var(--border-radius);
	box-shadow: none;
	box-sizing: border-box;
}
</style>