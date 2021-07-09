<template>
	<div class="send card">
		<!-- Autocomplete local addrs -->
		<h2 class="heading"><img class="img" src="@/assets/icons/north_east.svg">Send</h2>
		<div class="row"><Input v-model="InterfaceStore.wallet.send.address" :icon="require('@/assets/icons/person.svg')" placeholder="Address" autocomplete="ar" :mask="maskAddress" />
			<AddressIcon class="address-icon" :address="InterfaceStore.wallet.send.address" />
		</div>
		<div class="row" style="justify-content: flex-end;"></div>
		<h3 class="heading">Amount</h3>
		<InputAr v-model="InterfaceStore.wallet.send.amount" />
		<div class="row" style="justify-content: flex-end;">
			<button class="secondary" @click="setMax">Max</button>
		</div>
		<h3 class="heading">Data</h3>
		<!-- data upload handlers -->
		<InputData />
		<div class="row" style="justify-content: flex-end;"></div>
		<h3 class="heading">Tags</h3>
		<div v-for="tag in InterfaceStore.wallet.send.tags" :key="tag.name">tag</div>
		<div class="row" style="justify-content: flex-end;">
			<button class="secondary" @click="InterfaceStore.wallet.send.tags.push({name:'', value:''})">Add</button>
		</div>

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
import ArweaveStore from '@/store/ArweaveStore'
import InterfaceStore from '@/store/InterfaceStore'

export default {
	components: { Input, InputAr, InputData, AddressIcon },
	setup () {
		const maskAddress = (address) => {
			return address.match(/^[a-z0-9_-]{0,43}$/i)
		}
		const setMax = () => InterfaceStore.wallet.send.amount = ArweaveStore.currentWallet.balance
		return { InterfaceStore, maskAddress, setMax }
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
}

.heading {
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
}

button {
	background:none;
    border:none;
    margin:0;
    padding:0;
	font-size: 1em;
    cursor: pointer;
}
</style>