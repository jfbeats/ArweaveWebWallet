<template>
	<input class="slider input-box" type="range" min="1" max="1000000" v-model="value">
</template>

<script>
import { ref } from 'vue'

export default {
	setup () {
		const value = ref(50)
		return { value }
	}
}
</script>

<style scoped>
input[type="range"] {
	--height: 1.6em;
	--width-thumb: 1em;
	--color: #007cf8;
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
input[type="range"]::-webkit-slider-thumb {
	appearance: none;
	-webkit-appearance: none;
	width: var(--width-thumb);
	height: var(--height);
	background: var(--color);
	border: none;
	border-radius: 0;
	box-shadow: none;
	margin: 0;
}

input[type="range"]::-webkit-slider-runnable-track {
	height: var(--height);
	border-radius: var(--border-radius);
	box-shadow: none;
}

/*mozilla*/
input[type="range"]::-moz-range-thumb {
	width: var(--width-thumb);
	height: var(--height);
	background: var(--color);
	border: none;
	border-radius: 0;
	box-shadow: none;
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

input[type="range"]::-ms-thumb {
	width: var(--width-thumb);
	height: var(--height);
	background: var(--color);
	border: none;
	border-radius: 0;
	box-shadow: none;
	margin-top: 0;
	box-sizing: border-box;
}

input[type="range"]::-ms-track {
	height: var(--height);
	border-radius: var(--border-radius);
	box-shadow: none;
	box-sizing: border-box;
}
</style>