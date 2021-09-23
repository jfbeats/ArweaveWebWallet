<template>
	<div class="slider" :class="{ focus: focus || hover, snapped, disabled: !settings.max }" :style="{ '--thumb-width': thumbWidth+'%' }">
		<div class="slider-container input-box" :class="{ focus, hover }">
			<input v-model="model" type="range" min="0" :max="settings.max" :disabled="!settings.max" @focus="focus = true" @blur="focus = false" @mouseover="hover = true" @mouseleave="hover = false" @keydown="poke">
			<svg class="thumb" role="presentation" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
				<rect :x="thumbPosition+'%'" :width="thumbWidth+'%'" y="0" height="100%"></rect>
			</svg>
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
		const model = computed({
			get () { return props.modelValue },
			set (value) {
				const snapTo = snap(value)
				snapped.value = snapTo
				emit('update:modelValue', snapTo || value)
				console.log(snapTo || value)
			}
		})
		const snapped = ref(null)
		const range = computed(() => props.settings.max ? new BigNumber(props.settings.max.minus(props.settings.min || '0')) : null)
		const snapAmount = computed(() => range.value.dividedToIntegerBy('51'))
		const pokeAmount = computed(() => range.value.dividedToIntegerBy('50'))
		const snap = (e) => {
			if (!range.value) { return null }
			const bigNumber = new BigNumber(e)
			const result = { num: null, distance: range.value }
			for (const setting in props.settings) {
				if (!props.settings[setting]) { continue }
				const distance = props.settings[setting].minus(bigNumber).absoluteValue()
				if (distance.lt(result.distance)) { result.num = props.settings[setting].toString(); result.distance = distance }
			}
			if (result.distance.lt(snapAmount.value)) { return result.num }
			return null
		}
		const poke = (e) => {
			if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'ArrowUp' && e.key !== 'ArrowDown' || !range.value) { return }
			e.preventDefault()
			const currentValue = new BigNumber(model.value)
			let nextValue = null
			if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
				nextValue = currentValue.minus(pokeAmount.value)
				if (nextValue.isLessThan(props.settings.min || 0)) { nextValue = props.settings.min || 0 }
			}
			if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
				nextValue = currentValue.plus(pokeAmount.value)
				if (nextValue.isGreaterThan(props.settings.max)) { nextValue = props.settings.max }
			}
			model.value = nextValue.toString()
		}
		const focus = ref(false)
		const hover = ref(false)
		const rangeStart = computed(() => {
			if (!props.settings.minRange || !props.settings.maxRange || !range.value) { return null }
			return props.settings.minRange.dividedBy(range.value).times('100')
		})
		const rangeEnd = computed(() => {
			if (!props.settings.minRange || !props.settings.maxRange || !range.value) { return null }
			return props.settings.maxRange.dividedBy(range.value).times('100')
		})

		const thumbWidth = 4
		const thumbPosition = computed(() => new BigNumber(model.value).dividedBy(range.value || '1').times(100 - thumbWidth))

		return { model, range, focus, hover, poke, rangeStart, rangeEnd, snapped, thumbWidth, thumbPosition }
	}
}
</script>

<style scoped>
.slider {
	--height: 1.4em;
	--color: var(--element-secondary);
	--transition: 0.3s ease;
	position: relative;
}

.slider-container {
	width: 100%;
	overflow: hidden;
	position: relative;
}

.thumb {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	pointer-events: none;
	fill: var(--color);
	opacity: 0.2;
	transition: var(--transition);
}

.focus .thumb {
	opacity: 0.4;
}

.snapped.focus .thumb {
	opacity: 1;
}

.disabled .thumb {
	opacity: 0;
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
	opacity: 0 !important;
	appearance: none;
	-webkit-appearance: none;
	margin: 0;
	border: 0;
	border-radius: 0;
	box-shadow: none;
	opacity: 0.2;
	width: var(--thumb-width);
	height: 100%;
	background: var(--color);
	transition: var(--transition);
}

input[type="range"]::-moz-range-thumb {
	opacity: 0 !important;
	border: 0;
	border-radius: 0;
	box-shadow: none;
	opacity: 0.2;
	width: var(--thumb-width);
	height: 100%;
	background: var(--color);
	transition: var(--transition);
}

input[type="range"]::-ms-thumb {
	opacity: 0 !important;
	margin-top: 0;
	border: 0;
	border-radius: 0;
	box-shadow: none;
	box-sizing: border-box;
	opacity: 0.2;
	width: var(--thumb-width);
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