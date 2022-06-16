<template>
	<div class="row flex-row">
		<Input v-model.trim="model" :icon="IconPerson" placeholder="Address" :mask="maskAddress" :actions="actions" :disabled="disabled" :id="id"/>
		<AddressIcon class="address-icon" :address="model"/>
	</div>
	<Viewport>
		<Scanner v-if="scanning" @result="scanningResult" />
	</Viewport>
</template>



<script setup lang="ts">
import AddressIcon from '@/components/atomic/AddressIcon.vue'
import Input from '@/components/atomic/Input.vue'
import Viewport from '@/components/layout/Viewport.vue'
import Scanner from '@/components/function/Scanner.vue'
import { computed, ref } from 'vue'

import IconPerson from '@/assets/icons/person.svg?component'
import IconQR from '@/assets/icons/qr.svg?component'

const props = defineProps(['modelValue', 'actions', 'disabled', 'id'])
const emit = defineEmits(['update:modelValue'])

const model = computed({
	get () { return props.modelValue },
	set (value) { emit('update:modelValue', value) }
})

const maskAddress = (address: string) => { return address.match(/^[a-z0-9_-]{0,43}$/i) }
const scanning = ref(false)
const scanningResult = (result?: string) => {
	scanning.value = false
	if (!result) { return }
	if (!maskAddress(result)) { throw 'invalid address' }
	model.value = result
}

const actions = computed<Action[]>(() => {
	const result: Action[] = []
	if (Scanner.hasCamera.value) { result.push({ icon: IconQR, run: () => scanning.value = true }) }
	if (props.actions) { result.push(...props.actions) }
	return result
})
</script>



<style scoped>
.input {
	flex: 1 1 0;
}

.address-icon {
	flex: 0 0 auto;
	width: 3.5em;
	height: 3.5em;
	padding: 0;
	border-radius: var(--border-radius);
}

.row {
	min-height: 3em;
	align-items: center;
	justify-content: space-between;
}

</style>