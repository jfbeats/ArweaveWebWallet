<template>
	<div class="folding-layout">
		<div class="content">
			<div class="left">
				<slot name="left" />
			</div>
			<div class="right">
				<slot name="right" />
			</div>
		</div>
	</div>
</template>

<script>
export default {

}
</script>

<style scoped>
.folding-layout {
	width: 100%;
	/* height: 100%; */
	/* overflow: hidden; */
	/* transform: translateZ(0); */
}

.content {
	width: 100%;
	/* height: 100%; */
	/* overflow-y: auto; */
	position: relative;
}

.left {
	position: fixed;
	width: 40vw;
	height: 100vh;
	min-width: 0;
	/* max-width: 700px; */
	overflow-y: auto;
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
	min-width: 0;
	overflow-y: visible;
}

.verticalContent .right {
	padding-left: 0;
}
</style>