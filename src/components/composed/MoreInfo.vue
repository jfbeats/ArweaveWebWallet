<template>
	<!-- @click="expand=!expand" -->
	<div class="wrapper" :class="{ expand: expand }">
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
.wrapper {
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
}

.wrapper::-webkit-scrollbar {
	display: none;
}

.header {
	flex: 0 0 auto;
	/* cursor: pointer; */
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
}

.wrapper.expand .header {
	height: 35vh;
	max-height: 300px;
}
</style>