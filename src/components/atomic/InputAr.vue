<template>
	<div class="input-ar">
		<div class="input">
			<div class="icon-container">
				<div class="icon-background">
					<img class="icon no-select" src="@/assets/logos/arweave.svg" draggable="false">
				</div>
			</div>
			<input inputmode="numeric" class="text" placeholder="AR">
		</div>
		<div class="spacer"><div /><div /><div /></div>
		<div class="input">
			<input inputmode="numeric" class="text right" placeholder="CUR">
			<div class="icon-container">
				<div class="icon-background">
					<img class="icon no-select" src="@/assets/currency/usd.svg" draggable="false">
				</div>
			</div>
		</div>
	</div>
</template>



<script>
import ArweaveStore from '@/store/ArweaveStore'

export default {

}
</script>



<style scoped>
.input-ar {
	display: flex;
	border-radius: 4px;
}

.input {
	flex: 1 1 0;
	height: 3em;
	display: flex;
	align-items: center;
	justify-content: center;
	background: var(--background3);
	border-radius: inherit;
}

.spacer {
	width: var(--spacing);
	display: flex;
	flex-direction: column;
	background: var(--background3);
	border-radius: inherit;
}

.spacer div {
	flex: 0 0 1em;
}

.spacer div:not(:nth-child(2)) {
	flex: 1 1 0;
	background: var(--background2);
	border-radius: inherit;
}

.icon-container {
	flex: 0 0 auto;
	height: 3em;
	width: 3em;
	border-radius: inherit;
	padding: 3px;
}

.icon-background {
	width: 100%;
	height: 100%;
	background: var(--background2);
	border-radius: inherit;
	display: flex;
	align-items: center;
	justify-content: center;
}

.icon {
	width: 50%;
	height: 50%;
	object-fit: contain;
	opacity: var(--element-secondary-opacity);
}

.text {
	font-size: 1em;
	padding: 0 var(--spacing);
	outline: none;
	border: none;
	flex: 1 1 auto;
	height: 3em;
	background-color: transparent;
	color: var(--element-secondary);
	width: 100%;
}

.text.right {
	text-align: right;
}
</style>