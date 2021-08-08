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
	opacity: 0.7;
	filter: drop-shadow(0 0 10px #ffffff33);
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