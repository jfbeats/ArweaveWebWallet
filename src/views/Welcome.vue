<template>
	<div class="welcome">
		<transition name="slide-up" appear>
			<div class="logo-container" v-show="logoLoaded">
				<div class="logo-background">
					<img class="logo" src="@/assets/logos/arweave.svg" alt="Arweave Logo" @load="logoLoaded=true">
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
	</div>
</template>

<script>
import { ref } from '@vue/reactivity'

export default {
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
	backdrop-filter: brightness(2.5);
}

.logo-container {
	width: min(100%, 50vh);
	padding: min(16%, 8vh);
}

.logo-background {
	padding: 16%;
	background: #00000044;
	border-radius: 50%;
	display: flex;
	background: radial-gradient(#00000000, #00000099);
	box-shadow: 0 0 0 1px #ffffff22, 0 0 10px 0 #ffffff11;
}

.logo {
	width: 100%;
	height: 100%;
	opacity: 0.8;
	filter: drop-shadow(0 0 10px #ffffff22);
}

.content {
	flex: 1 1 auto;
	width: min(100%, 50vh);
	padding: min(16%, 8vh);
	display: flex;
	align-items: center;
	justify-content: center;
	text-align: center;
}
</style>