<template>
	<div class="send card">
		<form>
			<!-- TODO Autocomplete local addrs -->
			<label for="target">
				<h2 class="heading flex-row">
					<Icon :icon="IconNorthEast" />
					<span>Send</span>
				</h2>
			</label>
			<InputAddress v-model="form.target" id="target" />
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
			<InputAr v-model="form.quantity" id="quantity" />
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
			<InputData v-model="form.data" @files="dropped" id="data" />
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
				<div v-if="!form.tags.length">
					<button type="button" class="secondary" @click="addTag()" id="add-tag">Add</button>
				</div>
			</div>
			<InputGrid :schema="form.tags" />
			<div v-if="form.tags.length" class="row bottom flex-row">
				<div>
					<transition name="slide-up">
						<div v-if="validation.tags" class="validation">{{ validation.tags }}</div>
					</transition>
				</div>
				<button type="button" class="secondary" @click="addTag()" id="add-tag">Add</button>
			</div>

			<div class="row flex-row" style="align-items:flex-end; margin-top:3em;">
				<SendFee :size="txSize" :target="form.target" @update="fee => txFee = fee" />
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



<script setup lang="ts">
import InputAddress from '@/components/atomic/InputAddress.vue';
import InputAr from '@/components/atomic/InputAr.vue'
import InputData from '@/components/atomic/InputData.vue'
import InputGrid from '@/components/atomic/InputGrid.vue'
import SendFee from '@/components/composed/SendFee.vue'
import Button from '@/components/atomic/Button.vue'
import Icon from '@/components/atomic/Icon.vue'
import { Wallet } from '@/providers/WalletProxy'
import { dropped } from '@/functions/File'
import { form, addTag, getTagsFromSchema, reset } from '@/store/FormSend'
import { buildTransaction, manageUpload } from '@/functions/Transactions'
import { awaitEffect } from '@/functions/AsyncData'
import { addressHashToColor, addressToHash } from '@/functions/Utils'
import { notify } from '@/store/NotificationStore'
import BigNumber from 'bignumber.js'
import { computed, markRaw, reactive, ref, watch } from 'vue'

import IconNorthEast from '@/assets/icons/north_east.svg?component'

const props = defineProps<{ wallet: Wallet }>()

const setMax = async () => {
	const balance = new BigNumber(props.wallet.balance)
	await awaitEffect(() => txFee.value)
	form.quantity = balance.minus(txFee.value!).toString()
}

const txSize = computed(() => {
	const data = form.data
	return data.size || data.length || '0'
})
const txFee = ref(null as null | string)

const loading = ref(false)

const validation: { [key in keyof typeof form | 'global']?: string } = reactive({})

function isValid () {
	for (const key in validation) { delete validation[key as keyof typeof validation] }
	let result = true
	const quantity = new BigNumber(form.quantity || 0)
	if (!form.data && !quantity.gt(0)) {
		validation.global = "A transaction must at least have data, or an address and amount"
		return
	}
	const balance = new BigNumber(props.wallet.balance!)
	if (balance.minus(txFee.value || 0).minus(quantity).lt(0)) {
		if (quantity.gt(0)) {
			validation.quantity = "Current balance too low"; result = false
		} else {
			validation.data = "Current balance too low"; result = false
		}
	}
	const tags = getTagsFromSchema(form.tags)
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
	if (form.target.length && form.target.length < 43) {
		validation.target = "Invalid address"; result = false
	}
	if (!form.target.length && quantity.gt(0)) {
		validation.target = "An address must be specified to send AR"; result = false
	}
	return result
}

const postTx = async () => {
	if (loading.value || !isValid()) { return }
	loading.value = true
	try {
		const tx = await buildTransaction({
			target: form.target,
			ar: form.quantity,
			arReward: txFee.value,
			tags: getTagsFromSchema(form.tags),
			data: form.data,
		})
		await props.wallet.signTransaction(tx)
		manageUpload(tx)
		reset()
	} catch (e: any) {
		console.error(e)
		notify.error(e)
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

.secondary {
	color: var(--element-secondary);
}

.button {
	width: 50%;
}
</style>