<template>
	<InputGrid v-model="schema" />
</template>



<script setup lang="ts">
import InputGrid, { TagSchema } from '@/components/form/InputGrid.vue'
import { useDataWrapper } from '@/functions/AsyncData'
import { computed, effectScope, markRaw, reactive, toRef, watch } from 'vue'
import { ICON } from '@/store/Theme'

const props = defineProps<{
	modelValue: Tag[]
	disabled?: boolean
}>()
const emit = defineEmits<{
	(e: 'update:modelValue', value: Tag[]): void
}>()

const model = computed<Tag[]>({
	get () { return props.modelValue },
	set (value) { emit('update:modelValue', value); console.log(value) }
})

const schema = useDataWrapper(model,
	item => item.key ??= Math.random() + '',
	source => {
		const schema = tagSchema(source.name, source.value)
		const scope = effectScope(true)
		scope.run(() => {
			watch(() => ([schema.items[0].value, schema.items[1].value]), ([name, value]) => { source.name = name; source.value = value })
			watch(() => ([source.name, source.value]), ([name, value]) => { schema.items[0].value = name; schema.items[1].value = value})
		})
		schema.stop = scope.stop
		return schema
	},
	runtime => runtime.stop?.()
)

function tagSchema (name = '', value = ''): TagSchema { return reactive({
	items: [
		{ name: 'Tag', value: name, icon: markRaw(ICON.label), attrs: { disabled: props.disabled } },
		{ name: 'Value', value, attrs: { disabled: props.disabled }  }
	], deletable: !props.disabled, key: Math.random()
})}

function getTagsFromSchema (tagsSchema: TagSchema[]) {
	const result = []
	for (const row of tagsSchema) { result.push({ name: row.items[0].value, value: row.items[1].value }) }
	return result
}
</script>