<template>
	<div class="welcome">
		<transition name="slide-up" appear>
			<div class="logo-container" v-show="logoLoaded">
				<div class="logo-background">
					<img class="logo" src="@/assets/logos/arweaveOutline.svg" alt="Arweave Logo" @load="logoLoaded=true">
				</div>
			</div>
		</transition>
		<transition name="slide-up" appear>
			<div class="content">
				<div>
					<h1>{{ title }}</h1>
					<p>{{ description }}</p>
				</div>
			</div>
		</transition>
		<TravellingBlocks />
	</div>
</template>

<script>
import TravellingBlocks from '@/components/visual/TravellingBlocks.vue'
import { ref } from '@vue/reactivity'

export default {
	components: { TravellingBlocks },
	setup () {
		return {
			logoLoaded: ref(false),
			description: process.env.VUE_APP_DESCRIPTION,
			title: process.env.VUE_APP_TITLE,
		}
	}
}
</script>

<style scoped>
.welcome {
	width: 100%;
	min-height: 100%;
	padding: var(--spacing);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-around;
	background: #111;
	position: relative;
}

.logo-container {
	width: min(100%, 50vh);
	padding: min(16%, 8vh);
}

.logo-background {
	border-radius: 50%;
	display: flex;
}

.logo {
	width: 100%;
	height: 100%;
	opacity: 0.8;
}

.content {
	flex: 1 1 auto;
	width: min(100%, 50vh);
	padding: 0 min(16%, 8vh);
	display: flex;
	justify-content: center;
	text-align: center;
}

.travelling-blocks {
	position: absolute;
	width: 100%;
	height: 100%;
}
</style>