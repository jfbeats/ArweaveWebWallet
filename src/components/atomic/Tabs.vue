<template>
	<div v-if="queryName" class="tabs">
		<router-link class="tab" v-for="tab in tabs" :key="tab.name" :to="{query: { ...$route.query, [queryName]: tab.name.toLowerCase() }}" :style="{'--color': tab.color}" :class="{active: isActive(tab)}" replace>
			{{ tab.name }}
		</router-link>
	</div>
	<div v-else class="tabs">
		<button type="button" class="tab" v-for="tab in tabs" :key="tab.name" :style="{'--color': tab.color}" :class="{active: model === tab.name}" @click="model = tab.name" :disabled="disabled">
			{{ tab.name }}
		</button>
	</div>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

export default {
	props: ['queryName', 'tabs', 'modelValue', 'disabled'],
	setup (props, { emit }) {
		const model = computed({
			get () { return props.modelValue },
			set (value) { emit('update:modelValue', value) }
		})
		const route = useRoute()
		const isActive = (tab) => {
			const currentQuery = route.query[props.queryName]
			return currentQuery
				? currentQuery === tab.name.toLowerCase()
				: props.tabs.indexOf(tab) === 0
		}
		return { model, isActive }
	},
}
</script>

<style scoped>
.tabs {
	display: flex;
	align-items: center;
	justify-content: space-evenly;
}

.tab {
	padding: 0.2em 0;
	flex: 1 1 0;
	text-align: center;
	cursor: pointer;
	user-select: none;
	text-decoration: none;
	transition: color 0.2s ease, opacity 0.2s ease;
	opacity: var(--element-disabled-opacity);
	color: inherit;
	position: relative;
}

.tab:hover {
	opacity: 1;
}

.tab:disabled {
	opacity: var(--element-disabled-opacity);
	cursor: unset;
}

.tab.active {
	opacity: 1;
	color: var(--color);
}

.tab::before {
	content: "";
	background: var(--color);
	width: 12px;
	height: 2px;
	border-radius: 1px;
	position: absolute;
	margin: auto;
	left: 0;
	right: 0;
	bottom: 0;
	opacity: 0.5;
	transition: width 0.2s ease;
}

.tab.active::before {
	width: 100%;
	height: 2px;
	background: var(--color);
}
</style>