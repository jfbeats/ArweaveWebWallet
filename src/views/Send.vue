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
		<InputGrid :schema="InterfaceStore.wallet.send.tags" :deletable="true" />
		<div class="row" style="justify-content: flex-end;">
			<button class="secondary" @click="addTag">Add</button>
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
import InputGrid from '@/components/atomic/InputGrid.vue'
import AddressIcon from '@/components/atomic/AddressIcon.vue'
import ArweaveStore from '@/store/ArweaveStore'
import InterfaceStore from '@/store/InterfaceStore'

export default {
	components: { Input, InputAr, InputData, InputGrid, AddressIcon },
	setup () {
		const maskAddress = (address) => {
			return address.match(/^[a-z0-9_-]{0,43}$/i)
		}
		const setMax = () => InterfaceStore.wallet.send.amount = ArweaveStore.currentWallet.balance
		const addTag = () => InterfaceStore.wallet.send.tags.push({
			items: [
				{ name: 'Tag', value: '', icon: require('@/assets/icons/label.svg') },
				{ name: 'Value', value: '' }
			], 
			deletable: true,
			key: Math.random()
		})
		// TODO validate tags length
		const removeTag = function (index) { console.log(index) }
		return { InterfaceStore, maskAddress, setMax, addTag }
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
</style>