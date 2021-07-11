<template>
	<div class="send card">
		<!-- Autocomplete local addrs -->
		<h2 class="heading"><img class="img" src="@/assets/icons/north_east.svg">Send</h2>
		<div class="row">
			<Input v-model.trim="InterfaceStore.wallet.send.address" :icon="require('@/assets/icons/person.svg')" placeholder="Address" autocomplete="ar" :mask="maskAddress" />
			<AddressIcon class="address-icon" :address="InterfaceStore.wallet.send.address" />
		</div>
		<div class="row" style="justify-content:flex-end;"></div>

		<h3 class="heading">Amount</h3>
		<InputAr v-model="InterfaceStore.wallet.send.amount" />
		<div class="row" style="justify-content:flex-end;">
			<button class="secondary" @click="setMax">Max</button>
		</div>

		<h3 class="heading">Data</h3>
		<InputData v-model="InterfaceStore.wallet.send.data" />
		<div class="row" style="justify-content:flex-end;"></div>

		<h3 class="heading">Tags</h3>
		<InputGrid :schema="InterfaceStore.wallet.send.tags" :deletable="true" />
		<div class="row" style="justify-content:flex-end;">
			<button class="secondary" @click="addTag()">Add</button>
		</div>

		<div class="row" style="align-items:flex-end; margin-top:2em;">
			<div>
				<div>Size {{ txSizeDisplay }}</div>
				<div>Fee
					<Ar class="ar" :ar="txFee" />&nbsp;<LocaleCurrency class="small" :ar="txFee">|</LocaleCurrency>
				</div>
			</div>
			<div>Submit</div>
		</div>
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
import Ar from '@/components/atomic/Ar'
import LocaleCurrency from '@/components/atomic/LocaleCurrency'
import ArweaveStore, { arweave } from '@/store/ArweaveStore'
import InterfaceStore from '@/store/InterfaceStore'
import axios from 'axios'
import { debounce, humanFileSize } from '@/functions/Utils'
import { computed, ref, watch } from 'vue'

export default {
	components: { Input, InputAr, InputData, InputGrid, AddressIcon, Ar, LocaleCurrency },
	setup () {

		const maskAddress = (address) => { return address.match(/^[a-z0-9_-]{0,43}$/i) }

		const setMax = () => InterfaceStore.wallet.send.amount = ArweaveStore.currentWallet.balance

		watch(() => InterfaceStore.wallet.send.data, (value) => {
			let contentTypeTag = InterfaceStore.wallet.send.tags.find(row =>
				row.items[0].value === 'Content-Type')
			if (typeof value === 'object') {
				if (!contentTypeTag) {
					contentTypeTag = tagSchema('Content-Type')
					addTag(contentTypeTag)
				}
				contentTypeTag.items[1].value = value.type
			} else if (contentTypeTag) {
				const index = InterfaceStore.wallet.send.tags.indexOf(contentTypeTag)
				InterfaceStore.wallet.send.tags.splice(index, 1)
			}
		})

		// TODO validate tags length
		const tagSchema = (name, value) => ({
			items: [
				{ name: 'Tag', value: name || '', icon: require('@/assets/icons/label.svg') },
				{ name: 'Value', value: value || '' }
			], deletable: true, key: Math.random()
		})

		const addTag = (tag) => InterfaceStore.wallet.send.tags.push(tag || tagSchema())

		const txSize = computed(() => {
			const data = InterfaceStore.wallet.send.data
			return data.size || data.length || '0'
		})
		const txSizeDisplay = computed(() => humanFileSize(txSize.value))
		const txFee = ref(null)
		const feeUrl = computed(() => ArweaveStore.gatewayURL + 'price/' + txSize.value + '/' + InterfaceStore.wallet.send.address)
		const updateFee = async () => { txFee.value = arweave.ar.winstonToAr((await axios.get(feeUrl.value)).data) }
		const updateFeeDebounced = debounce(updateFee)
		updateFee()
		watch(() => feeUrl.value, () => updateFeeDebounced())

		return { InterfaceStore, maskAddress, setMax, addTag, txSizeDisplay, txFee }
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

.small {
	font-size: 0.75em;
	color: var(--element-secondary);
}
</style>