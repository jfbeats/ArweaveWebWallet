<template>
	<div class="input">
		<img class="icon" :src="icon">
		<input class="text" :placeholder="placeholder">
		<!-- QR -->
	</div>
</template>

<script>
export default {
	props: ['icon', 'placeholder']

}
</script>

<style scoped>
.input {
	display: flex;
	border-radius: 4px;
	padding: 4px;
	align-items: center;
	justify-content: center;
	background: var(--background3);
}

.icon {
	flex: 0 0 auto;
	border-radius: inherit;
	height: 3em;
	width: 3em;
	object-fit: contain;
	padding: 0.75em 0;
	opacity: 0.5;
	background: var(--background);
}

.text {
	font-size: 1em;
	padding: 0 var(--spacing);
	outline: none;
	border: none;
	flex: 1 1 auto;
	height: 2em;
	background-color: transparent;
	color: var(--element-secondary);
	width: 100%;
}
</style>