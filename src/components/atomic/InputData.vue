<template>
	<div class="input-data input-box" :class="{ focus }" @drop.stop.prevent="handleFiles">
		<textarea v-show="!isFile" v-model="model" @focus="focus=1" @blur="focus=0" :disabled="disabled" :id="id" :placeholder="placeholder"></textarea>
		<transition name="fade">
			<div v-if="!model && !dragOverlay" class="overlay passthrough">
				<div class="big-icon-container"><img class="img" src="@/assets/icons/text.svg"></div>
				<div class="spacer" />
				<div class="big-icon-container not-passthrough">
					<label for="file-picker" class="file-picker-label"><img class="img" src="@/assets/icons/drop.svg"></label>
					<input type="file" id="file-picker" class="file-input" @change="handleFiles" :disabled="disabled">
				</div>
			</div>
			<div v-else-if="isFile" class="overlay">
				<div class="big-icon-container focus"><img class="img" src="@/assets/icons/cloud.svg"></div>
				<button class="clear" @click="clearFiles" type="button">
					<div class="icon-container">
						<img class="icon no-select" src="@/assets/icons/x.svg" draggable="false">
					</div>
				</button>
			</div>
		</transition>
		<DragOverlay />
	</div>
</template>



<script>
import DragOverlay from '@/components/atomic/DragOverlay.vue'
import InterfaceStore from '@/store/InterfaceStore'
import { computed, ref, toRef } from 'vue'

export default {
	components: { DragOverlay },
	props: ['modelValue', 'disabled', 'id', 'placeholder'],
	setup (props, { emit, attrs }) {
		const model = computed({
			get () { return props.modelValue },
			set (value) { emit('update:modelValue', value) }
		})
		const focus = ref(0)
		const dragOverlay = toRef(InterfaceStore, 'dragOverlay')
		const handleFiles = (e) => {
			if (attrs.disabled) { return }
			if (e.dataTransfer?.files) { return emit('files', e.dataTransfer.files) }
			if (e.target?.files) { return emit('files', e.target.files) }
		}
		const clearFiles = () => { emit('files', null) }
		const isFile = computed(() => typeof model.value === "object")
		return { model, focus, dragOverlay, handleFiles, clearFiles, isFile }
	}
}
</script>



<style scoped>
.input-data {
	height: 12em;
	position: relative;
	overflow: hidden;
	display: flex;
}

textarea {
	font-family: inherit;
	resize: none;
	width: 100%;
	height: 100%;
	font-size: 1em;
	padding: var(--spacing);
	outline: none;
	border: none;
	background-color: transparent;
	color: var(--element-secondary);
	text-align: inherit;
}

.overlay {
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.spacer {
	width: 1px;
	height: 56px;
	margin: 0 var(--spacing);
	background: #ffffff18;
	transition: 0.3s ease;
}

.focus .spacer {
	background: #ffffff60;
}

.big-icon-container {
	width: 48px;
	height: 48px;
	position: relative;
	display: flex;
}

.file-picker-label {
	position: absolute;
	width: 100%;
	height: 100%;
	z-index: 1;
	cursor: pointer;
}

.img {
	width: 100%;
	height: 100%;
	opacity: 0.2;
	transition: 0.3s ease;
}

.focus .img {
	opacity: 0.6;
}

.file-input {
	position: absolute;
	width: 100%;
	height: 100%;
	border-radius: var(--border-radius);
	display: none;
}

.clear {
	position: absolute;
	height: 100%;
	right: 0;
}

.passthrough {
	pointer-events: none;
}

.not-passthrough {
	pointer-events: auto;
}

/* extract */
.icon-container {
	flex: 0 0 auto;
	height: 3em;
	width: 3em;
	border-radius: inherit;
	padding: 3px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.icon {
	height: 1.4em;
	width: 1.4em;
	object-fit: contain;
	opacity: var(--element-secondary-opacity);
	transition: 0.3s ease;
}

.symbol {
	font-size: 1.4em;
	opacity: var(--element-secondary-opacity);
	transition: 0.3s ease;
}

.focus .icon,
.focus .symbol {
	opacity: 1;
}
</style>