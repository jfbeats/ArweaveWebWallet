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
	align-items: flex-end;
	cursor: pointer;
	color: inherit;
	text-decoration: none;
}

.text {
	padding: 0 var(--spacing);
}
</style>