<template>
	<div class="carousel flex-row no-scrollbar">
		<transition-group name="fade-list">
			<div class="margin" key="margin1"></div>
			<slot />
			<div class="margin" key="margin2"></div>
		</transition-group>
	</div>
</template>



<script>

</script>



<style scoped>
.carousel {
	overflow: auto;
	scroll-snap-type: x mandatory;
}

.margin {
	flex: 1 0 auto;
	width: calc(var(--current-vw) * 0.8);
}
</style>