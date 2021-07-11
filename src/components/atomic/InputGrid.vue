<template>
	<div v-if="schema.length > 0" class="input-list" :class="{ focus }">
		<div v-for="(row, index) in schema" :key="row.key" class="row">
			<div class="inputs">
				<div v-for="(input, inputIndex) in row.items" :key="row.key + input.name" class="input" :class="{ flip: row.items.length==2 && inputIndex==1 }">
					<Icon :icon="input.icon" />
					<input v-model="input.value" v-bind="input.attrs" class="text" :placeholder="input.name" @focus="focus=(index+1)*(inputIndex+1)" @blur="focus=0">
				</div>
			</div>
			<button v-if="row.deletable" @click="removeRow(index)">
				<Icon :icon="require('@/assets/icons/x.svg')" />
			</button>
		</div>
	</div>
</template>



<script>
import Icon from '@/components/atomic/Icon.vue'
import { ref } from 'vue'

export default {
	components: { Icon },
	props: ['schema'],
	setup (props) {
		const focus = ref(0)
		const removeRow = (index) => props.schema.splice(index, 1)
		return { focus, removeRow }
	}
}
</script>



<style scoped>
.input-list {
	display: flex;
	flex-direction: column;
	align-items: center;
	border-radius: var(--border-radius);
	border: 1px solid #ffffff24;
	background: #ffffff06;
	transition: 0.3s ease;
}

.input-list.focus {
	border: 1px solid #ffffff88;
	background: #ffffff08;
	box-shadow: 0 0 10px 0 #ffffff11;
}

.row {
	width: 100%;
	display: flex;
}

.inputs {
	flex: 1 1 0;
	min-width: 0;
	display: flex;
}

.vertical .inputs {
	flex-direction: column;
}

.input {
	flex: 1 1 auto;
	min-width: 0;
	height: inherit;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: inherit;
}

.icon {
	opacity: var(--element-secondary-opacity);
}

.focus .icon {
	opacity: 1;
}

.text {
	flex: 1 1 0;
	min-width: 0;
	width: 0;
	height: 3.5em;
	font-size: 1em;
	padding: 0 var(--spacing);
	outline: none;
	border: none;
	background-color: transparent;
	color: var(--element-secondary);
}

.input.flip {
	flex-direction: row-reverse;
}

.input.flip .text {
	text-align: end;
}

.input-list:not(.vertical) .input:not(.flip):not(:first-child)::before {
	content: "";
	width: 1px;
	height: 1.2em;
	background: #ffffff18;
	transition: 0.3s ease;
}

.input-list:not(.vertical).focus .input:not(.flip):not(:first-child)::before {
	background: #ffffff60;
}

.input-list:not(.vertical) .input.flip::after {
	content: "";
	width: 1px;
	height: 1.2em;
	background: #ffffff18;
	transition: 0.3s ease;
}

.input-list:not(.vertical).focus .input.flip::after {
	background: #ffffff60;
}

.vertical .text:first-child {
	margin-inline-start: 3em;
}
</style>