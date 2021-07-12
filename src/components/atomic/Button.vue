<template>
	<button class="button">
		<slot></slot>
	</button>
</template>



<script>
export default {

}
</script>



<style scoped>
.button {
	min-width: 14em;
	padding: var(--spacing);
	border-radius: var(--border-radius);
	background: #ffffff06;
	/* border: 1px solid var(--border); */
	transition: 0.3s ease;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 0 10px 0 var(--glow-color);
}

.button:hover {
	color: white;
	background: #ffffff08;
	box-shadow: 0 0 20px 0 var(--glow-color);
}
</style>