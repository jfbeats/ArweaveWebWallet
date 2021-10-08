<template>
	<div class="welcome">
		<transition name="slide-down" appear>
			<div class="column">
				<div class="logo-background">
					<ArweaveOutlineLogo class="logo" />
				</div>
			</div>
		</transition>
		<transition name="slide-down" appear>
			<div class="column content">
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
import ArweaveOutlineLogo from '@/components/visual/ArweaveOutlineLogo.vue'
import TravellingBlocks from '@/components/visual/TravellingBlocks.vue'

export default {
	components: { ArweaveOutlineLogo, TravellingBlocks },
	setup () {
		return {
			description: import.meta.env.VITE_DESCRIPTION,
			title: import.meta.env.VITE_TITLE,
		}
	}
}
</script>

<style scoped>
.welcome {
	width: 100%;
	min-height: var(--current-vh);
	padding: 92px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-around;
	background: #111;
	position: relative;
}

.column {
	width: 100%;
	max-width: 35vh;
	min-width: 256px;
	margin-bottom: 92px;
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
	display: flex;
	justify-content: center;
	text-align: center;
}

.travelling-blocks {
	position: absolute;
	width: 100%;
	height: 100%;
	opacity: 0.8;
}
</style>