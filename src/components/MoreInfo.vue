<template>
	<div class="placeholder"></div>
	<div class="wrapper" @click="expand=!expand" :class="{expand: expand}">
		<div class="header">
			<slot name="icon"></slot>
		</div>
		<transition name="fade">
			<div v-if="expand" class="content" @click.stop>
				<slot name="content"></slot>
			</div>
		</transition>
	</div>
</template>

<script>
export default {
	data () {
		return { expand: false }
	}
}
</script>

<style scoped>
.placeholder {
	width: 48px;
}

.wrapper {
	position: absolute;
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 48px;
	height: 48px;
	max-height: 48px;
	transition: all 0.4s ease;
	border-radius: var(--border-radius2);
	background: var(--background);
	scrollbar-width: none;
	overflow-y: auto;
	overflow-y: overlay;
	overflow-x: hidden;
	z-index: 1;
	box-shadow: 0 0 0 1px transparent;
}

.wrapper:hover {
	box-shadow: 0 0 0 1px var(--border);
}

.wrapper::-webkit-scrollbar {
  display: none;
}

.header {
	flex: 0 0 auto;
	cursor: pointer;
	transition: all 0.4s ease;
	overflow: hidden;
	width: 100%;
	height: 48px;
	max-height: 48px;
}

.content {
	padding: var(--spacing);
}

.wrapper.expand {
	width: 100%;
	height: 50vh;
	max-height: 500px;
	z-index: 2;
	box-shadow: 0 0 0 1px var(--border);
}

.wrapper.expand .header {
	/* padding: 48px 0; */
	height: 35vh;
	max-height: 300px;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>