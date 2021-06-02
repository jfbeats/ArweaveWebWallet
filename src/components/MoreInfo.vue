<template>
	<div class="wrapper" @click="expand=!expand" :class="{expand: expand}">
		<div class="icon">
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
.wrapper {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 48px;
	height: 48px;
	transition: all 0.4s ease;
	border-radius: var(--border-radius2);
	background: var(--background);
	scrollbar-width: none;
	overflow-y: auto;
	overflow-x: hidden;
}

.wrapper::-webkit-scrollbar {
  display: none;
}

.icon {
	cursor: pointer;
	transition: all 0.4s ease;
}

.content {
	padding: var(--spacing);
}

.expand {
	height: auto;
	width: 100%;
	height: 400px;
}

.expand .icon {
	padding: 48px 0;
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