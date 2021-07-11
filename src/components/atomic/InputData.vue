<template>
	<div class="input-data" :class="{ focus }">
		<textarea v-model="model" @focus="focus=1" @blur="focus=0"></textarea>
		<transition name="fade">
			<div v-if="!model && !dragOverlay" class="overlay">
				<div class="icon-container"><img class="img" src="@/assets/icons/text.svg"></div>
				<div class="spacer" />
				<div class="file-picker icon-container">
					<label for="file-picker" class="file-picker-label"><img class="img" src="@/assets/icons/drop.svg"></label>
					<input type="file" id="file-picker" class="file-input">
				</div>
			</div>
		</transition>
		<DragOverlay />
	</div>
</template>



<script>
import DragOverlay from '@/components/atomic/DragOverlay.vue'
import InterfaceStore from '@/store/InterfaceStore'
import { computed, ref } from 'vue'

export default {
	components: { DragOverlay },
	props: ['modelValue'],
	setup (props, { emit }) {
		const model = computed({
			get () { return props.modelValue },
			set (value) { emit('update:modelValue', value) }
		})
		const focus = ref(0)
		const dragOverlay = computed(() => InterfaceStore.dragOverlay)
		return { model, focus, dragOverlay }
	}
}
</script>



<style scoped>
.input-data {
	height: 12em;
	position: relative;
	overflow: hidden;
	border-radius: var(--border-radius);
	background: #ffffff06;
	border: 1px solid #ffffff24;
	transition: 0.3s ease;
}

.input-data.focus {
	border: 1px solid #ffffff88;
	background: #ffffff08;
	box-shadow: 0 0 10px 0 #ffffff11;
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
}

.overlay {
	pointer-events: none;
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

.icon-container {
	width: 48px;
	height: 48px;
}

.file-picker {
	pointer-events: auto;
	position: relative;
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
}

.file-input::-webkit-file-upload-button {
	visibility: hidden;
}

.file-input::before {
	content: "";
	position: absolute;
	display: inline-block;
	outline: none;
	white-space: nowrap;
	user-select: none;
	cursor: pointer;
	font-size: 1em;
}

.file-input:active::before {
	background: var(--background3);
}
</style>