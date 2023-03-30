<template>
	<div class="row flex-row">
		<Input v-model.trim="model" :icon="ICON.person" placeholder="Address" :mask="maskAddress" :actions="actions" :submit="submit" :disabled="disabled" :id="id"/>
		<AddressIcon class="address-icon" :address="model"/>
	</div>
</template>



<script setup lang="ts">
import AddressIcon from '@/components/atomic/AddressIcon.vue'
import Input from '@/components/form/Input.vue'
import { scan, hasCamera } from '@/functions/Scanner'
import { computed } from 'vue'

import { ICON } from '@/store/Theme'
import { ArweaveAccount } from '@/providers/Arweave'

const props = defineProps<{
	modelValue: string
	actions?: Action[]
	submit?: Action
	disabled?: boolean
	id?: string
}>()
const emit = defineEmits(['update:modelValue'])

const model = computed({
	get () { return props.modelValue },
	set (value) { emit('update:modelValue', value) }
})

const maskAddress = (address: string) => ArweaveAccount.metadata.isAddress(address, true)

const scanAddress = async () => {
	const result = await scan()
	if (!maskAddress(result)) { throw 'invalid address' }
	model.value = result
}

const actions = computed<Action[]>(() => {
	const result: Action[] = []
	if (hasCamera.value) { result.push({ icon: ICON.qr, run: () => scanAddress() }) }
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