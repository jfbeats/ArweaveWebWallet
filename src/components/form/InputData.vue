<template>
	<div class="input-data input-box" :class="{ focus }" @drop.stop.prevent="handleFiles">
		<textarea ref="textarea" v-show="!isFile" v-model="model" @focus="focus = 1" @blur="focus = 0" :disabled="disabled" :id="id" :placeholder="placeholder" :autocapitalize="autocapitalize"></textarea>
		<transition name="fade">
			<div v-if="!model" class="overlay passthrough">
				<Icon :icon="ICON.text" class="big-icon-container not-passthrough img text" style="flex: 0 1 auto;" @click="() => textarea?.focus()" />
				<div class="spacer" />
				<Link class="big-icon-container not-passthrough" @click="() => filePicker?.click()" :class="{ isDragging: dragOverlay }">
					<div class="file-picker-label">
						<Icon :icon="ICON.drop" class="img" style="width: 100%; height: 100%;" />
					</div>
					<input ref="filePicker" type="file" id="file-picker" class="file-input" @change="handleFiles" :disabled="disabled" multiple />
				</Link>
				<template v-if="hasDirectoryInput">
					<div class="spacer" />
					<Link class="big-icon-container not-passthrough" @click="() => directoryPicker?.click()" :class="{ isDragging: dragOverlay }">
						<div class="file-picker-label">
							<Icon :icon="ICON.folder" class="img" style="width: 100%; height: 100%;" />
						</div>
						<input ref="directoryPicker" type="file" id="directory-picker" class="file-input" @change="handleFiles" :disabled="disabled" webkitdirectory directory multiple />
					</Link>
				</template>
				<template v-if="hasCamera">
					<div class="spacer" />
					<Link class="big-icon-container not-passthrough" @click="scanData">
						<div class="file-picker-label">
							<Icon :icon="ICON.qr" class="img" style="width: 100%; height: 100%;" />
						</div>
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
						<Icon :icon="ICON.x" class="iconX no-select" draggable="false" />
					</div>
				</Link>
			</div>
		</transition>
	</div>
</template>



<script setup lang="ts">
import TxCard from '@/components/composed/TxCard.vue'
import Link from '@/components/function/Link.vue'
import Icon from '@/components/atomic/Icon.vue'
import { scan, hasCamera } from '@/functions/Scanner'
import InterfaceStore from '@/store/InterfaceStore'
import { state } from '@/functions/Channels'
import { dropped } from '@/functions/File'
import { computed, ref, toRef, useAttrs, watch } from 'vue'
import { ICON } from '@/store/Theme'
import { debounce } from '@/functions/Utils'

const props = defineProps<{
	modelValue?: string | ArDataItemParams[]
	type?: 'keyfile' | 'data'
	disabled?: boolean
	id?: string
	placeholder?: string
	autocapitalize?: 'none'
	onFiles?: any
}>()
const emit = defineEmits<{
	(e: 'update:modelValue', value: string | ArDataItemParams[]): void
	(e: 'files', files?: DragEvent | InputEvent | FileSystemDirectoryHandle | FileSystemFileHandle[] | string): void
}>()
const attrs = useAttrs()
const filePicker = ref()
const directoryPicker = ref()
const textarea = ref()

const model = computed({
	get () { return props.modelValue },
	set (value) { value != undefined && emit('update:modelValue', value) }
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
const scanData = async () => handleFiles(await scan())
const handleFiles = (e: DragEvent | InputEvent | FileSystemDirectoryHandle | FileSystemFileHandle[] | string) => {
	if (attrs.disabled) { return }
	if (!props.onFiles) { dropped(e, props.type) }
	return emit('files', e)
}
const clearFiles = () => { dropped(undefined, props.type); emit('files') }
const isFile = computed(() => Array.isArray(model.value) && model.value.length > 0)
const checkContent = debounce(async (content: typeof model['value']) => {
	if (typeof content !== 'string' || props.disabled) { return }
	if (await dropped(content, props.type, true)) { model.value = '' }
})
watch(model, value => checkContent(value))
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

textarea::placeholder {
	text-align: center;
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
	background: #ffffff18;
	transition: 0.3s ease;
}

.focus .spacer {
	background: #ffffff60;
}

.big-icon-container {
	box-sizing: content-box;
	width: 48px;
	height: 48px;
	padding: calc(var(--spacing) / 2) var(--spacing);
	position: relative;
	display: flex;
}

.file-picker-label {
	width: 100%;
	height: 100%;
	z-index: 1;
	cursor: pointer;
}

.img {
	opacity: 0.2;
	transition: 0.3s ease;
}

.img.text {
	cursor: text;
}

.focus .img {
	opacity: 0.3;
}

.focus .img.text,
.big-icon-container:hover .img,
.big-icon-container:focus .img,
.img:hover {
	opacity: 0.6;
}

.big-icon-container.isDragging .img {
	opacity: 1;
	color: #fff;
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