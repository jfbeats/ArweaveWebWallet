<template>
	<button class="button no-select">
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
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 0 calc(var(--spacing) / 2) 0 var(--glow-color);
	transition: 0.3s ease;
}

.button:hover {
	background: #ffffff08;
	box-shadow: 0 0 var(--spacing) 0 var(--glow-color);
	filter: brightness(1.3);
}

.button:active {
	filter: brightness(0.7);
	box-shadow: 0 0 var(--spacing) 0 transparent;
	transition: 0s;
}
</style>