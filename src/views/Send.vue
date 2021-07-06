<template>
	<div class="send card">
		<!-- Autocomplete local addrs -->
		<h2 class="heading"><img class="img" src="@/assets/icons/north_east.svg">Send</h2>
		<div class="row"><Input v-model="form.address" :icon="require('@/assets/icons/person.svg')" placeholder="Arweave address" autocomplete="ar" @blur="validateAddress" /><AddressIcon class="address-icon" :address="form.address" /></div>
		<div class="row" style="justify-content: flex-end;"></div>
		<h3 class="heading">Amount</h3>
		<InputAr v-model="form.amount" />
		<div class="row" style="justify-content: flex-end;"><span class="secondary">Max</span></div>
		<h3 class="heading">Data</h3>
		<!-- data upload handlers -->
		<InputData />
		<!-- display: fees -->
		<!-- submit -->
		<!-- QR -->
	</div>
</template>

<script>
import Input from '@/components/atomic/Input.vue'
import InputAr from '@/components/atomic/InputAr.vue'
import InputData from '@/components/atomic/InputData.vue'
import AddressIcon from '@/components/atomic/AddressIcon.vue'
import { reactive } from 'vue'

export default {
	components: { Input, InputAr, InputData, AddressIcon },
	setup () {
		const form = reactive({
			address: '',
			amount: '',
			data: '',
		})
		const validateAddress = (address) => {
			if (!form.address.match(/^[a-z0-9_-]{43}$/i)) {
				form.address = ''
			}
		}
		return { form, validateAddress }
	}
}
</script>

<style scoped>
.send {
	/* padding-top: 0; */
}

.input {
	flex: 1 1 0;
}

.address-icon {
	flex: 0 0 auto;
	width: 4em;
	height: 4em;
	padding: 0;
}

.heading {
	/* margin-top: calc(var(--spacing) * 2); */
	display: flex;
	align-items: center;
	gap: var(--spacing);
}

.row {
	min-height: 2em;
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin: calc(var(--spacing) / 2) 0;
	gap: var(--spacing);
}

.img {
	height: 1em;
}

.secondary {
	color: var(--element-secondary);
	cursor: pointer;
}
</style>