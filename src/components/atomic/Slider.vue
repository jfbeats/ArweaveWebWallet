<template>
	<div class="slider" :class="{ focus }">
		<div class="slider-container input-box" :class="{ focus }">
			<input v-model="model" type="range" min="0" :max="settings.max" :disabled="!settings.max" @focus="focus = true" @blur="focus = false" @keydown="poke">
		</div>
		<svg v-if="rangeStart" class="range" role="presentation" width="100%" height="8" xmlns="http://www.w3.org/2000/svg">
			<rect :x="rangeStart.toString() +'%'" :width="rangeEnd.minus(rangeStart).toString() +'%'" y="50%" height="2" rx="1" ry="1"></rect>
		</svg>
	</div>
</template>

<script>
import BigNumber from 'bignumber.js'
import { computed, ref } from 'vue'

export default {
	props: ['modelValue', 'settings'],
	setup (props, { emit }) {
		// TODO snap
		const model = computed({
			get () { return props.modelValue },
			set (value) { emit('update:modelValue', value); console.log(value) }
		})
		const marks = computed(() => Object.values(props.settings).sort((a, b) => a - b))
		const range = computed(() => props.settings.max ? new BigNumber(props.settings.max.minus(props.settings.min || '0')) : null)
		const poke = (e) => {
			if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' || !range.value) { return }
			e.preventDefault()
			const currentValue = new BigNumber(model.value)
			const pokeAmount = range.value.dividedToIntegerBy('100')
			let nextValue = null
			if (e.key === 'ArrowLeft') { 
				nextValue = currentValue.minus(pokeAmount)
				if (nextValue.isLessThan(props.settings.min || 0)) { nextValue = props.settings.min || 0 }
			}
			if (e.key === 'ArrowRight') { 
				nextValue = currentValue.plus(pokeAmount)
				if (nextValue.isGreaterThan(props.settings.max)) { nextValue = props.settings.max }
			}
			model.value = nextValue.toString()
		}
		const focus = ref(false)
		const rangeStart = computed(() => {
			if (!props.settings.minRange || !props.settings.maxRange || !range.value) { return null }
			return props.settings.minRange.dividedBy(range.value).times('100').integerValue()
		})
		const rangeEnd = computed(() => {
			if (!props.settings.minRange || !props.settings.maxRange || !range.value) { return null }
			return props.settings.maxRange.dividedBy(range.value).times('100').integerValue()
		})
		return { model, range, focus, poke, rangeStart, rangeEnd }
	}
}
</script>

<style scoped>
.slider {
	--height: 1.4em;
	--width-thumb: 8px;
	--color: var(--element-secondary);
	--transition: 0.3s ease;
	position: relative;
}

.slider-container {
	width: 100%;
	overflow: hidden;
}

input[type="range"] {
	font-size: 1rem;
	appearance: none;
	-webkit-appearance: none;
	position: relative;
	margin: 0;
	padding: 0;
	border: 0;
	outline: 0;
	border-radius: inherit;
	height: var(--height);
	width: 100%;
	background: transparent;
	cursor: pointer;
	display: flex;
	/* overflow: hidden; */
}

input[type="range"]:focus {
	outline: 0;
}

.range {
	position: absolute;
	fill: var(--color);
	opacity: 0;
	transition: var(--transition);
}

.focus .range {
	opacity: 1;
	filter: drop-shadow(0 0 6px #ffffff66);
}

/* -------------------------------------------- */

input[type="range"]::-webkit-slider-runnable-track {
	border: 0;
	box-shadow: none;
	height: 100%;
	width: 100%;
}

input[type="range"]::-moz-range-track {
	border: 0;
	box-shadow: none;
	height: 100%;
	width: 100%;
}

input[type="range"]::-ms-track {
	border: 0;
	box-shadow: none;
	box-sizing: border-box;
	height: 100%;
	width: 100%;
}

/* -------------------------------------------- */

input[type="range"]::-webkit-slider-thumb {
	appearance: none;
	-webkit-appearance: none;
	margin: 0;
	border: 0;
	border-radius: 0;
	box-shadow: none;
	opacity: 0.2;
	width: var(--width-thumb);
	height: 100%;
	background: var(--color);
	transition: var(--transition);
}

input[type="range"]::-moz-range-thumb {
	border: 0;
	border-radius: 0;
	box-shadow: none;
	opacity: 0.2;
	width: var(--width-thumb);
	height: 100%;
	background: var(--color);
	transition: var(--transition);
}

input[type="range"]::-ms-thumb {
	margin-top: 0;
	border: 0;
	border-radius: 0;
	box-shadow: none;
	box-sizing: border-box;
	opacity: 0.2;
	width: var(--width-thumb);
	height: 100%;
	background: var(--color);
	transition: var(--transition);
}

/* -------------------------------------------- */

input[type="range"]:focus::-webkit-slider-thumb {
	opacity: 1;
}

input[type="range"]:disabled::-webkit-slider-thumb {
	opacity: 0;
}

input[type="range"]:focus::-moz-range-thumb {
	opacity: 1;
}

input[type="range"]:disabled::-moz-range-thumb {
	opacity: 0;
}

input[type="range"]:focus::-ms-thumb {
	opacity: 1;
}

input[type="range"]:disabled::-ms-thumb {
	opacity: 0;
}

/* -------------------------------------------- */

input[type="range"]::-ms-fill-upper {
	background: transparent;
	border: 0;
}

input[type="range"]::-ms-fill-lower {
	background: transparent;
	border: 0;
}
</style>