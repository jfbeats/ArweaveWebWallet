import { markRaw, reactive } from 'vue'
import { buildTransaction, manageUpload } from '@/functions/Transactions'
import { notify } from '@/store/NotificationStore'
import { TagField, TagSchema } from '@/components/atomic/InputGrid.vue'
import type { FileWithPath } from 'file-selector'
import type { Wallet } from '@/providers/WalletProxy'

import IconLabel from '@/assets/icons/label.svg?component'



export const form = reactive({
	target: '',
	quantity: '',
	data: '' as string | FileWithPath,
	tags: [] as TagSchema[],
	txFee: null as null | string,
})
const init = { ...form }



const tagSchema = (name?: string, value?: string): TagSchema => ({
	items: [
		{ name: 'Tag', value: name || '', icon: markRaw(IconLabel) },
		{ name: 'Value', value: value || '' }
	], deletable: true, key: Math.random()
})



export function addTag (tag?: TagSchema) { form.tags.push(tag || tagSchema()) }

export function getTagsFromSchema (tagsSchema: TagSchema[]) {
	const result = []
	for (const row of tagsSchema) { result.push({ name: row.items[0].value, value: row.items[1].value }) }
	return result
}

export function addFiles (files: FileWithPath[]) {
	let data: string | FileWithPath = ''
	let type: string = ''
	if (files.length > 1) {
		notify.warn('Directory upload available soon, only using the first file for now')
		data = files[0]
		type = files[0].type
	} else if (files.length) {
		data = files[0]
		type = files[0].type
	}
	let contentTypeTag = form.tags.find(row => row.items[0].value === 'Content-Type')
	form.data = data
	if (data && type) {
		if (!contentTypeTag) {
			contentTypeTag = tagSchema('Content-Type')
			addTag(contentTypeTag)
		}
		contentTypeTag.items[1].value = type
	} else {
		const index = form.tags.indexOf(contentTypeTag!)
		if (index !== -1) { form.tags.splice(index, 1) }
	}
}

export async function submit (wallet: Wallet) {
	try {
		if (!form.txFee) { return notify.error('Transaction fee not set') }
		const tx = await buildTransaction({
			target: form.target,
			ar: form.quantity,
			arReward: form.txFee,
			tags: getTagsFromSchema(form.tags),
			data: form.data,
		})
		await wallet.signTransaction(tx)
		manageUpload(tx)
		reset()
	} catch (e: any) {
		console.error(e)
		notify.error(e)
	}
}

export function reset () { Object.assign(form, init) }