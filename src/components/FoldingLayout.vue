<template>
	<div class="folding-layout">
		<div class="left" :class="{ hasRight: hasRight() }">
			<slot name="left" />
		</div>
		<div class="right">
			<slot name="right" />
		</div>
	</div>
</template>

<script>
export default {
	methods: {
		hasLeft () { return !!this.$slots.left },
		hasRight () { return !!this.$slots.right },
	}
}
</script>

<style scoped>
.folding-layout {
	width: 100%;
	position: relative;
}

.left.hasRight {
	position: fixed;
	width: 40vw;
	height: 100vh;
	overflow: auto;
	z-index: 1;
}

.verticalContent .left {
	position: relative;
	width: 100%;
	height: auto;
}

.right {
	padding-left: 40vw;
	width: 100%;
}

.verticalContent .right {
	padding-left: 0;
}
</style>