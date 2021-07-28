<template>
	<div class="send card">
		<form>
			<!-- TODO Autocomplete local addrs -->
			<label for="target">
				<h2 class="heading"><img class="img" src="@/assets/icons/north_east.svg">Send</h2>
			</label>
			<div class="row">
				<Input v-model.trim="model.target" :icon="require('@/assets/icons/person.svg')" placeholder="Address" autocomplete="ar" :mask="maskAddress" id="target" />
				<AddressIcon class="address-icon" :address="model.target" />
			</div>
			<div class="row bottom">
				<div>
					<transition name="slide-up">
						<div v-show="validation.target" class="validation">{{ validation.target }}</div>
					</transition>
				</div>
			</div>

			<label for="quantity">
				<h3 class="heading">Amount</h3>
			</label>
			<InputAr v-model="model.quantity" id="quantity" />
			<div class="row bottom">
				<div>
					<transition name="slide-up">
						<div v-show="validation.quantity" class="validation">{{ validation.quantity }}</div>
					</transition>
				</div>
				<button type="button" class="secondary" @click="setMax">Max</button>
			</div>

			<label for="data">
				<h3 class="heading">Data</h3>
			</label>
			<InputData v-model="model.data" @files="(files) => model.data = files ? files[0] : ''" id="data" />
			<div class="row bottom">
				<div>
					<transition name="slide-up">
						<div v-if="validation.data" class="validation">{{ validation.data }}</div>
					</transition>
				</div>
			</div>

			<div class="row">
				<label for="add-tag">
					<h3 class="heading" style="display:block;">Tags</h3>
				</label>
				<div v-if="!model.tags.length"><button type="button" class="secondary" @click="addTag()" id="add-tag">Add</button></div>
			</div>
			<InputGrid :schema="model.tags" />
			<div v-if="model.tags.length" class="row bottom">
				<div>
					<transition name="slide-up">
						<div v-if="validation.tags" class="validation">{{ validation.tags }}</div>
					</transition>
				</div>
				<button type="button" class="secondary" @click="addTag()" id="add-tag">Add</button>
			</div>

			<div class="row" style="align-items:flex-end; margin-top:3em;">
				<div>
					<div>Size {{ txSizeDisplay }}</div>
					<div>Fee
						<Ar class="ar" :ar="txFee" />&nbsp;<LocaleCurrency class="small secondary" :ar="txFee">|</LocaleCurrency>
					</div>
				</div>
				<Button @click="postTx" :style="submitStyle" :disabled="loading" :icon="require('@/assets/icons/north_east.svg')">
					Submit
				</Button>
			</div>
			<div>
				<transition name="slide-up">
					<div v-if="validation.global" class="row bottom" style="justify-content:center;">
						<div style="text-align:center;" class="validation">{{ validation.global }}</div>
					</div>
				</transition>
			</div>
		</form>
		<!-- TODO QR -->
	</div>
</template>



<script>
import Input from '@/components/atomic/Input.vue'
import InputAr from '@/components/atomic/InputAr.vue'
import InputData from '@/components/atomic/InputData.vue'
import InputGrid from '@/components/atomic/InputGrid.vue'
import AddressIcon from '@/components/atomic/AddressIcon.vue'
import Ar from '@/components/atomic/Ar.vue'
import LocaleCurrency from '@/components/atomic/LocaleCurrency.vue'
import Button from '@/components/atomic/Button.vue'
import Icon from '@/components/atomic/Icon.vue'
import ArweaveStore, { arweave } from '@/store/ArweaveStore'
import { buildTransaction, manageUpload } from '@/functions/Transactions'
import Ledger from '@/functions/Ledger'
import axios from 'axios'
import BigNumber from 'bignumber.js'
import { debounce, humanFileSize, addressToColor } from '@/functions/Utils'
import { computed, reactive, ref, watch } from 'vue'

export default {
	components: { Input, InputAr, InputData, InputGrid, AddressIcon, Ar, LocaleCurrency, Button, Icon },
	props: ['wallet', 'model'],
	setup (props) {
		const maskAddress = (address) => { return address.match(/^[a-z0-9_-]{0,43}$/i) }
		const setMax = () => {
			const balance = new BigNumber(props.wallet.balance)
			props.model.quantity = balance.minus(txFee.value || 0).toString()
		}
		watch(() => props.model.data, (value) => {
			let contentTypeTag = props.model.tags.find(row =>
				row.items[0].value === 'Content-Type')
			if (typeof value === 'object') {
				if (!contentTypeTag) {
					contentTypeTag = tagSchema('Content-Type')
					addTag(contentTypeTag)
				}
				contentTypeTag.items[1].value = value.type
			} else if (contentTypeTag) {
				const index = props.model.tags.indexOf(contentTypeTag)
				props.model.tags.splice(index, 1)
			}
		})
		const tagSchema = (name, value) => ({
			items: [
				{ name: 'Tag', value: name || '', icon: require('@/assets/icons/label.svg') },
				{ name: 'Value', value: value || '' }
			], deletable: true, key: Math.random()
		})
		const addTag = (tag) => props.model.tags.push(tag || tagSchema())
		const txSize = computed(() => {
			const data = props.model.data
			return data.size || data.length || '0'
		})
		const txSizeDisplay = computed(() => humanFileSize(txSize.value))
		const txFee = ref(null)
		const feeUrl = computed(() => {
			const address = props.model.target
			return ArweaveStore.gatewayURL + 'price/' + txSize.value + '/' + (address.match(/^[a-z0-9_-]{43}$/i) ? address : '')
		})
		const updateFee = async () => { txFee.value = arweave.ar.winstonToAr((await axios.get(feeUrl.value)).data) }
		const updateFeeDebounced = debounce(updateFee)
		updateFee()
		watch(() => feeUrl.value, () => updateFeeDebounced())
		const getTagsFromSchema = (tagsSchema) => {
			const result = []
			for (const row of tagsSchema) { result.push({ name: row.items[0].value, value: row.items[1].value }) }
			return result
		}
		const loading = ref(false)
		const validation = reactive({ target: '', quantity: '', data: '', tags: '' })
		const isValid = () => {
			for (const key in validation) { validation[key] = '' }
			let result = true
			if (!props.model.data.length && !(props.model.target.length && props.model.quantity)) {
				validation.global = "A transaction must at least have data, or an address and amount"
				return
			}
			const balance = new BigNumber(props.wallet.balance)
			if (balance.minus(txFee.value).minus(props.model.quantity) < 0) {
				validation.quantity = "Current balance too low"; result = false
			}
			const tags = getTagsFromSchema(props.model.tags)
			let tagLength = 0
			for (const tag of tags) {
				tagLength += tag.name.length + tag.value.length
				if (tagLength > 2048) {
					validation.tags = "Length of tags can't be greater than 2048"; result = false
				}
				if (!tag.name.length || !tag.value.length) {
					validation.tags = "Tags can't be empty"; result = false
				}
			}
			if (props.model.target.length && props.model.target.length < 43) {
				validation.target = "Invalid address"; result = false
			}
			if (!props.model.target.length && props.model.quantity) {
				validation.target = "An address must be specified to send AR"; result = false
			}
			return result
		}
		const postTx = async () => {
			if (loading.value || !isValid()) { return }
			loading.value = true
			try {
				const tx = await buildTransaction(
					props.model.target,
					props.model.quantity,
					getTagsFromSchema(props.model.tags),
					props.model.data
				)
				if (props.wallet.jwk) { await arweave.transactions.sign(tx, props.wallet.jwk) }
				else if (props.wallet.metaData.provider === 'Ledger') {
					if (props.wallet.key !== await Ledger.getActiveAddress()) { alert('Wrong account'); return }
					await Ledger.sign(tx)
				}
				manageUpload(tx)
				props.model.target = '' 
				props.model.quantity = ''
				props.model.data = '' 
				props.model.tags = []
			} catch (e) {
				console.error(e)
			}
			loading.value = false
			// TODO visual feedback
		}
		const submitStyle = {
			'--border': `rgba(${addressToColor(props.wallet.key).join(',')},0.8)`,
			'--glow-color': `rgba(${addressToColor(props.wallet.key).join(',')},0.2)`,
			'background-image': `radial-gradient(circle at center, rgba(${addressToColor(props.wallet.key).join(',')},0.4), 
			rgba(${addressToColor(props.wallet.key).join(',')},0.3))`
		}
		return { maskAddress, setMax, addTag, txSizeDisplay, txFee, postTx, submitStyle, loading, validation }
	}
}
</script>



<style scoped>
.send {
	display: flex;
	flex-direction: column;
}

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
	min-height: 3em;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: var(--spacing);
}

.row.bottom {
	padding-top: 1em;
}

.validation {
	color: var(--orange);
}

.img {
	height: 1em;
}

.secondary {
	color: var(--element-secondary);
}

.small {
	font-size: 0.75em;
}

.button {
	width: 50%;
}
</style>