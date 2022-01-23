<template>
	<div class="welcome">
		<div class="flex-column">
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
						<p>Alpha</p>
					</div>
				</div>
			</transition>
			<div class="spacer" />
		</div>
		<TravellingBlocks />
	</div>
</template>



<script setup>
import ArweaveOutlineLogo from '@/assets/logos/arweaveOutline.svg?component'
import TravellingBlocks from '@/components/visual/TravellingBlocks.vue'

const description = import.meta.env.VITE_DESCRIPTION
const title = import.meta.env.VITE_TITLE
</script>



<style scoped>
.welcome {
	--fixed-spacing: min(92px, 50vw);
	--spacing: min(var(--fixed-spacing), min(16vw, 7vh));
	width: 100%;
	min-height: var(--current-vh);
	padding: var(--fixed-spacing);
	padding-top: var(--spacing);
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
	min-width: 320px;
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
	min-width: min(320px, 100vw);
	max-width: min(35vh, 100vw);
}

h1 {
	margin-top: 0;
}
</style>