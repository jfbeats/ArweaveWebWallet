<template>
	<router-link class="action">
		<Icon :icon="icon" />
		<span class="text">
			<slot></slot>
		</span>
	</router-link>
</template>

<script>
import Icon from '@/components/atomic/Icon.vue'

export default {
	components: { Icon },
	props: ['icon'],
}
</script>

<style scoped>
.action {
	font-size: 1.2em;
	display: flex;
	align-items: center;
	cursor: pointer;
	color: inherit;
	text-decoration: none;
	box-shadow: 0 0 0 -8px #ffffff00;
	transition: 0.2s ease;
}

.action:hover {
	background: #00000022;
}

.action.router-link-active {
	box-shadow: -5px 0 0 -3px var(--element-secondary);
}

[dir="rtl"] .action.router-link-active {
	box-shadow: 5px 0 0 -3px var(--element-secondary);
}

.icon {
	/* height: 1em; */
	font-size: 1.2em;
}

.text {
	padding: 0 var(--spacing);
}
</style>