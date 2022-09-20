<template>
	<div class="input-data input-box" :class="{ focus }" @drop.stop.prevent="handleFiles">
		<textarea v-show="!isFile" v-model="model" @focus="focus = 1" @blur="focus = 0" :disabled="disabled" :id="id" :placeholder="placeholder"></textarea>
		<transition name="fade">
			<div v-if="!model && !dragOverlay" class="overlay passthrough">
				<Icon :icon="IconText" class="big-icon-container img" />
				<div class="spacer" />
				<Link class="big-icon-container not-passthrough" @click="() => filePicker?.click()">
					<div class="file-picker-label">
						<Icon :icon="IconDrop" class="img" style="width: 100%; height: 100%;" />
					</div>
					<input ref="filePicker" type="file" id="file-picker" class="file-input" @change="handleFiles" :disabled="disabled" multiple />
				</Link>
				<template v-if="hasDirectoryInput">
					<div class="spacer" />
					<Link class="big-icon-container not-passthrough" @click="() => directoryPicker?.click()">
						<div class="file-picker-label">
							<Icon :icon="IconFolder" class="img" style="width: 100%; height: 100%;" />
						</div>
						<input ref="directoryPicker" type="file" id="directory-picker" class="file-input" @change="handleFiles" :disabled="disabled" webkitdirectory directory multiple />
					</Link>
				</template>
			</div>
			<div v-else-if="isFile" class="overlay">
				<div class="files-scroll">
					<div class="files flex-column">
						<TxCard v-for="tx in model" :key="tx.key ??= Math.random().toString()" :tx="tx" :options="{ half: true }" />
					</div>
				</div>
				<Link class="clear" @click="clearFiles" type="button">
					<div class="icon-container">
						<Icon :icon="IconX" class="iconX no-select" draggable="false" />
					</div>
				</Link>
			</div>
		</transition>
		<DragOverlay />
	</div>
</template>



<script setup lang="ts">
import TxCard from '@/components/composed/TxCard.vue'
import DragOverlay from '@/components/atomic/DragOverlay.vue'
import Link from '@/components/function/Link.vue'
import Icon from '@/components/atomic/Icon.vue'
import InterfaceStore from '@/store/InterfaceStore'
import { state } from '@/functions/Channels'
import { computed, ref, toRef, useAttrs } from 'vue'

import IconText from '@/assets/icons/text.svg?component'
import IconDrop from '@/assets/icons/drop.svg?component'
import IconFolder from '@/assets/icons/folder.svg?component'
import IconX from '@/assets/icons/x.svg?component'

const props = defineProps<{
	modelValue: string | ArDataItemParams[]
	disabled?: boolean
	id?: string
	placeholder?: string
}>()
const emit = defineEmits<{
	(e: 'update:modelValue', value: string | ArDataItemParams[]): void
	(e: 'files', files?: DragEvent | InputEvent | FileSystemDirectoryHandle | FileSystemFileHandle[]): void
}>()
const attrs = useAttrs()
const filePicker = ref()
const directoryPicker = ref()

const model = computed({
	get () { return props.modelValue },
	set (value) { emit('update:modelValue', value) }
})
const focus = ref(0)
const dragOverlay = toRef(InterfaceStore, 'dragOverlay')
const hasDirectoryInput = testDirectoryPicker()
function testDirectoryPicker() {
	const elem = document.createElement('input')
	const dir = 'directory'
	const domPrefixes = [ "", "moz", "o", "ms", "webkit" ]
	elem.type = 'file'
	for (const prefix in domPrefixes) {
		if (domPrefixes[prefix] + dir in elem) {
			return true
		}
	}
	return false
}
const handleDirectoryPicker = computed(() => { // API doesn't work in iframe
	const showDirectoryPicker = (window as any).showDirectoryPicker as ((options?: any) => Promise<FileSystemDirectoryHandle>) | undefined
	if (state.value.type === 'iframe' || state.value.type === 'extension') { return }
	if (attrs.disabled || !showDirectoryPicker) { return }
	return async () => {
		const files = await showDirectoryPicker()
		handleFiles(files)
	}
})
const handleFilePicker = computed(() => { // API doesn't work in iframe
	const showOpenFilePicker = (window as any).showOpenFilePicker as ((options?: any) => Promise<FileSystemFileHandle[]>) | undefined
	if (state.value.type === 'iframe' || state.value.type === 'extension') { return }
	if (attrs.disabled || !showOpenFilePicker) { return }
	return async () => {
		const files = await showOpenFilePicker({ multiple: true })
		handleFiles(files)
	}
})
const handleFiles = (e: DragEvent | InputEvent | FileSystemDirectoryHandle | FileSystemFileHandle[]) => {
	if (attrs.disabled) { return }
	return emit('files', e)
}
const clearFiles = () => { emit('files') }
const isFile = computed(() => Array.isArray(model.value) && model.value.length > 0)
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
	width: 0.5px;
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

/* todo extract */
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

.files-scroll {
	width: 100%;
	max-height: 100%;
	flex: 1 1 0;
	overflow: auto;
}

.files {
	padding: var(--spacing);
	flex: 1 1 0;
}
</style>