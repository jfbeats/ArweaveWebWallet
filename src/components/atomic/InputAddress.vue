<template>
	<div class="row flex-row">
		<Input v-model.trim="model" :icon="IconPerson" placeholder="Address" :mask="maskAddress" :actions="actions" :disabled="disabled" :id="id"/>
		<AddressIcon class="address-icon" :address="model"/>
	</div>
</template>



<script>
import AddressIcon from '@/components/atomic/AddressIcon.vue'
import Input from '@/components/atomic/Input.vue'

import IconPerson from '@/assets/icons/person.svg'
import { computed } from 'vue';

export default {
	components: { AddressIcon, Input },
	props: ['modelValue', 'actions', 'disabled', 'id'],
	setup (props, { emit }) {
		const model = computed({
			get () { return props.modelValue },
			set (value) { emit('update:modelValue', value) }
		})
		const maskAddress = (address) => { return address.match(/^[a-z0-9_-]{0,43}$/i) }
		return { model, maskAddress, IconPerson }
	}
}
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