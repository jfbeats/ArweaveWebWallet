<template>
	<div class="send card">
		<form>
			<!-- TODO Autocomplete local addrs -->
			<label for="target">
				<h2 class="heading flex-row">
					<IconNorthEast class="img" />
					<span>Send</span>
				</h2>
			</label>
			<InputAddress v-model="model.target" id="target" />
			<div class="row bottom flex-row">
				<div>
					<transition name="slide-up">
						<div v-show="validation.target" class="validation">{{ validation.target }}</div>
					</transition>
				</div>
			</div>

			<label for="quantity">
				<h3 class="heading flex-row">
					<span>Amount</span>
				</h3>
			</label>
			<InputAr v-model="model.quantity" id="quantity" />
			<div class="row bottom flex-row">
				<div>
					<transition name="slide-up">
						<div v-show="validation.quantity" class="validation">{{ validation.quantity }}</div>
					</transition>
				</div>
				<button type="button" class="secondary" @click="setMax">Max</button>
			</div>

			<label for="data">
				<h3 class="heading flex-row">
					<span>Data</span>
				</h3>
			</label>
			<InputData v-model="model.data" @files="filesAdded" id="data" />
			<div class="row bottom flex-row">
				<div>
					<transition name="slide-up">
						<div v-if="validation.data" class="validation">{{ validation.data }}</div>
					</transition>
				</div>
			</div>

			<div class="row flex-row">
				<label for="add-tag">
					<h3 class="heading flex-row" style="display:block;">
						<span>Tags</span>
					</h3>
				</label>
				<div v-if="!model.tags.length">
					<button type="button" class="secondary" @click="addTag()" id="add-tag">Add</button>
				</div>
			</div>
			<InputGrid :schema="model.tags" />
			<div v-if="model.tags.length" class="row bottom flex-row">
				<div>
					<transition name="slide-up">
						<div v-if="validation.tags" class="validation">{{ validation.tags }}</div>
					</transition>
				</div>
				<button type="button" class="secondary" @click="addTag()" id="add-tag">Add</button>
			</div>

			<div class="row flex-row" style="align-items:flex-end; margin-top:3em;">
				<SendFee :size="txSize" :target="model.target" @update="fee => txFee = fee" />
				<Button @click="postTx" :style="submitStyle" :disabled="loading || !txFee || !wallet.signTransaction" :icon="IconNorthEast">Submit</Button>
			</div>
			<div>
				<transition name="slide-up">
					<div v-if="validation.global" class="row bottom flex-row" style="justify-content:center;">
						<div style="text-align:center;" class="validation">{{ validation.global }}</div>
					</div>
				</transition>
			</div>
		</form>
		<!-- TODO QR -->
	</div>
</template>



<script>
import InputAddress from '@/components/atomic/InputAddress.vue';
import InputAr from '@/components/atomic/InputAr.vue'
import InputData from '@/components/atomic/InputData.vue'
import InputGrid from '@/components/atomic/InputGrid.vue'
import SendFee from '@/components/composed/SendFee.vue'
import Button from '@/components/atomic/Button.vue'
import { buildTransaction, manageUpload } from '@/functions/Transactions'
import { awaitEffect } from '@/functions/AsyncData'
import { addressHashToColor, addressToHash } from '@/functions/Utils'
import BigNumber from 'bignumber.js'
import { computed, markRaw, reactive, ref, watch } from 'vue'

import IconNorthEast from '@/assets/icons/north_east.svg?component'
import IconLabel from '@/assets/icons/label.svg?component'

export default {
	components: { InputAddress, InputAr, InputData, InputGrid, SendFee, Button, IconNorthEast },
	props: ['wallet', 'model'],
	setup (props) {
		const setMax = async () => {
			const balance = new BigNumber(props.wallet.balance)
			await awaitEffect(() => txFee.value)
			props.model.quantity = balance.minus(txFee.value).toString()
		}

		const filesAdded = (files) => {
			let contentTypeTag = props.model.tags.find(row => row.items[0].value === 'Content-Type')
			props.model.data = files ? files[0] : ''
			if (props.model.data && props.model.data.type) {
				if (!contentTypeTag) {
					contentTypeTag = tagSchema('Content-Type')
					addTag(contentTypeTag)
				}
				contentTypeTag.items[1].value = props.model.data.type
			} else {
				const index = props.model.tags.indexOf(contentTypeTag)
				props.model.tags.splice(index, 1)
			}
		}

		const tagSchema = (name, value) => ({
			items: [
				{ name: 'Tag', value: name || '', icon: markRaw(IconLabel) },
				{ name: 'Value', value: value || '' }
			], deletable: true, key: Math.random()
		})
		const addTag = (tag) => props.model.tags.push(tag || tagSchema())

		const txSize = computed(() => {
			const data = props.model.data
			return data.size || data.length || '0'
		})
		const txFee = ref(null)

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
			if (!props.model.data && !(props.model.quantity > 0)) {
				validation.global = "A transaction must at least have data, or an address and amount"
				return
			}
			const balance = new BigNumber(props.wallet.balance)
			if (balance.minus(txFee.value).minus(props.model.quantity || 0) < 0) {
				if (props.model.quantity > 0) {
					validation.quantity = "Current balance too low"; result = false
				} else {
					validation.data = "Current balance too low"; result = false
				}
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
			if (!props.model.target.length && props.model.quantity > 0) {
				validation.target = "An address must be specified to send AR"; result = false
			}
			return result
		}

		const resetForm = () => {
			props.model.target = ''
			props.model.quantity = ''
			props.model.data = ''
			props.model.tags = []
			// TODO reset the fee slider
		}

		const postTx = async () => {
			if (loading.value || !isValid()) { return }
			loading.value = true
			try {
				const tx = await buildTransaction({
					target: props.model.target,
					ar: props.model.quantity,
					arReward: txFee.value,
					tags: getTagsFromSchema(props.model.tags),
					data: props.model.data,
				})
				await props.wallet.signTransaction(tx)
				manageUpload(tx)
				resetForm()
			} catch (e) {
				console.error(e)
			}
			loading.value = false
		}

		const addressHash = ref(null)
		watch(() => props.wallet.key, async (val) => addressHash.value = await addressToHash(val), { immediate: true })
		const addressHashColor = computed(() => addressHashToColor(addressHash.value).join(','))
		const submitStyle = computed(() => ({
			'--border': `rgba(${addressHashColor.value},0.8)`,
			'--glow-color': `rgba(${addressHashColor.value},0.2)`,
			'background-image': `radial-gradient(circle at center, rgba(${addressHashColor.value},0.4), 
			rgba(${addressHashColor.value},0.3))`
		}))

		return { setMax, filesAdded, addTag, txSize, txFee, postTx, submitStyle, loading, validation, IconNorthEast }
	}
}
</script>



<style scoped>
.send {
	display: flex;
	flex-direction: column;
}

.heading {
	align-items: center;
}

.row {
	min-height: 3em;
	align-items: center;
	justify-content: space-between;
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

.button {
	width: 50%;
}
</style>