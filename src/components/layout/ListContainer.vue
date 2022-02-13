<template>
	<div class="list-container flex-column">
		<slot name="header" />
		<div class="container">
			<slot />
		</div>
	</div>
</template>



<style scoped>
.list-container {
	padding-bottom: 0;
}

.container {
	flex: 1 1 0;
	background: var(--background);
	border-radius: var(--border-radius) var(--border-radius) 0 0;
	align-items: center;
	justify-content: flex-start;
	overflow: hidden;
	position: relative;
	min-height: min(300px, calc(var(--current-vh) - calc(var(--spacing) + 5px)));
}
</style>