<template>
	<router-link class="action">
		<img class="img" :src="img">
		<span class="text">
			<slot></slot>
		</span>
	</router-link>
</template>

<script>
export default {
	props: ['img'],
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

.action.router-link-active {
	box-shadow: -5px 0 0 -3px var(--element-secondary);
}

[dir="rtl"] .action.router-link-active {
	box-shadow: 5px 0 0 -3px var(--element-secondary);
}

.img {
	height: 1em;
}

.text {
	padding: 0 var(--spacing);
}
</style>