<template>
	<div class="input-data input-box" :class="{ focus }" @drop.stop.prevent="handleFiles">
		<textarea v-show="!isFile" v-model="model" @focus="focus = 1" @blur="focus = 0" :disabled="disabled" :id="id" :placeholder="placeholder"></textarea>
		<transition name="fade">
			<div v-if="!model && !dragOverlay" class="overlay passthrough">
				<Icon :icon="IconText" class="big-icon-container img" />
				<div class="spacer" />
				<div class="big-icon-container not-passthrough">
					<label for="file-picker" class="file-picker-label">
						<Icon :icon="IconDrop" class="img" style="width: 100%; height: 100%;" />
					</label>
					<input type="file" id="file-picker" class="file-input" @change="handleFiles" :disabled="disabled" multiple />
				</div>
			</div>
			<div v-else-if="isFile" class="overlay">
				<Icon :icon="IconCloud" class="big-icon-container focus" />
				<button class="clear" @click="clearFiles" type="button">
					<div class="icon-container">
						<Icon :icon="IconX" class="iconX no-select" draggable="false" />
					</div>
				</button>
			</div>
		</transition>
		<DragOverlay />
	</div>
</template>



<script setup lang="ts">
import DragOverlay from '@/components/atomic/DragOverlay.vue'
import Icon from '@/components/atomic/Icon.vue'
import InterfaceStore from '@/store/InterfaceStore'
import { computed, ref, toRef, useAttrs } from 'vue'

import IconText from '@/assets/icons/text.svg?component'
import IconDrop from '@/assets/icons/drop.svg?component'
import IconCloud from '@/assets/icons/cloud.svg?component'
import IconX from '@/assets/icons/x.svg?component'

const props = defineProps<{
	modelValue: string
	disabled?: boolean
	id?: string
	placeholder?: string
}>()
const emit = defineEmits<{
	(e: 'update:modelValue', value: string): void
	(e: 'files', files?: Event): void
}>()
const attrs = useAttrs()

// todo add icon for showDirectoryPicker()
const model = computed({
	get () { return props.modelValue },
	set (value) { emit('update:modelValue', value) }
})
const focus = ref(0)
const dragOverlay = toRef(InterfaceStore, 'dragOverlay')
const handleFiles = (e: DragEvent | InputEvent) => {
	if (attrs.disabled) { return }
	return emit('files', e)
}
const clearFiles = () => { emit('files') }
const isFile = computed(() => typeof model.value === "object")
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
	touch-action: none;
}

.not-passthrough {
	pointer-events: auto;
	touch-action: auto;
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

.iconX {
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

.focus .iconX,
.focus .symbol {
	opacity: 1;
}
</style>