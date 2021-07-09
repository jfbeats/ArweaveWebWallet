<template>
	<div class="tabs">
		<router-link class="tab" v-for="tab in tabs" :key="tab.name" :to="{query: { ...$route.query, [query]: tab.name.toLowerCase() }}" :style="{'--color': tab.color}" :class="{active: isActive(tab)}" replace>
			{{ tab.name }}
		</router-link>
	</div>
</template>

<script>
export default {
	props: ['query', 'tabs'],
	methods: {
		isActive (tab) {
			const currentQuery = this.$route.query[this.query]
			return currentQuery 
				? currentQuery === tab.name.toLowerCase()
				: this.tabs.indexOf(tab) === 0
		}
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
	padding: 0.5em 0;
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