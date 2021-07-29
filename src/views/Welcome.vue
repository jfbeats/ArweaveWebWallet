<template>
	<div class="welcome">
		<div class="logo-container">
			<div class="logo-background">
				<img class="logo" src="@/assets/logos/arweave.svg">
			</div>
		</div>
		<div class="content">
			<div>
				<h1>{{ title }}</h1>
				<p>{{ description }}</p>
			</div>
		</div>
	</div>
</template>

<script>

export default {
	setup () {
		return { description: process.env.VUE_APP_DESCRIPTION, title: process.env.VUE_APP_TITLE }
	}
}
</script>

<style scoped>
.welcome {
	width: 100%;
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
	display: flex;
	flex-direction: column;
}

.logo-background {
	height: 100%;
	padding: 16%;
	background: #00000044;
	border-radius: 50%;
	display: flex;
	flex-direction: column;
	background: radial-gradient(#00000000, #00000099);
}

.logo {
	opacity: 0.7;
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