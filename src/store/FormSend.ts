import { markRaw, reactive } from 'vue'
import { TagField, TagSchema } from '@/components/atomic/InputGrid.vue'
import type { FileWithPath } from 'file-selector'

import IconLabel from '@/assets/icons/label.svg?component'




export const form = reactive({
	target: '',
	quantity: '',
	data: '' as string | FileWithPath,
	tags: [] as TagSchema[],
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

export function reset () { Object.assign(form, init) }