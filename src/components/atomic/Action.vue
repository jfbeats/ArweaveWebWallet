<template>
	<div class="action">
		<img class="img" :src="img">
		<span class="text">
			<slot></slot>
		</span>
	</div>
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
}

.text {
	padding: 0 var(--spacing);
}
</style>