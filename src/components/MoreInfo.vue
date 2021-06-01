<template>
	<div class="wrapper" @click="expand=!expand" :class="{expand: expand}">
		<div class="icon">
			<slot name="icon"></slot>
		</div>
		<transition name="fade">
			<div class="content" v-if="expand">
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
	overflow: hidden;
	border-radius: var(--border-radius2);
	background: var(--background);
	border: 1px solid transparent;
}

.icon {
	cursor: pointer;
	transition: all 0.4s ease;
}

.content {
	flex: 1 1 0;
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.expand {
	height: auto;
	width: 100%;
	height: 300px;
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