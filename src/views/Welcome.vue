<template>
	<div class="welcome flex-column">
		<div class="main flex-column">
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
		</div>
		<TravellingBlocks />
	</div>
</template>



<script setup>
import TravellingBlocks from '@/components/visual/TravellingBlocks.vue'
import { LOGO } from '@/store/Theme'

const ArweaveOutlineLogo = LOGO.arweaveOutline
const description = import.meta.env.VITE_DESCRIPTION
const title = import.meta.env.VITE_TITLE
</script>



<style scoped>
.welcome {
	width: 100%;
	min-height: var(--current-vh);
	display: flex;
	flex-direction: column;
	align-items: center;
	background: #111;
	position: relative;
}

.main {
	--fixed-spacing: min(92px, 50vw);
	--spacing: min(var(--fixed-spacing), min(16vw, 7vh));
	padding: var(--fixed-spacing);
	padding-top: var(--spacing);
	padding-bottom: 0;
	flex: 1 1 auto;
	align-items: center;
	justify-content: center;
}

.travelling-blocks {
	width: 100%;
	height: 200px;
}

.column {
	width: 100%;
	max-width: 35vh;
	min-width: 320px;
}

.logo-background {
	border-radius: 50%;
	display: flex;
}

.logo {
	width: 100%;
	height: 100%;
}

.content {
	display: flex;
	justify-content: center;
	text-align: center;
	min-width: min(320px, 100vw);
	max-width: min(35vh, 100vw);
}

h1 {
	margin-top: 0;
}
</style>