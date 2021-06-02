<template>
	<Toolbar class="toolbar" />
	<router-view class="main" />
</template>



<script>
import Toolbar from '@/components/Toolbar'
export default {
	components: {
		Toolbar
	},
}
</script>



<style scoped>
.toolbar {
	flex: 0 0 auto;
	display: flex;
	flex-direction: column;
	outline: 1px solid var(--border);
	overflow: scroll;
	scrollbar-width: none;
}

@media only screen and (max-width: 600px) {
	.toolbar {
		flex-direction: row;
	}
}

.toolbar::-webkit-scrollbar {
  display: none;
}

.main {
	flex: 1 1 auto;
	overflow: hidden scroll;
}
</style>



<style>
html {
	box-sizing: border-box;
	width: 100%;
	height: 100%;
	background: #0f0f0f;

	--spacing: 24px;
	--background: #141414;
	--background2: #181818;
	--background3: #262626;
	--border: #222;
	--border-radius: 8px;
	--border-radius2: 8px;
	--border-radius3: 12px;
	--element-secondary: #ccc;
	--element-secondary-opacity: 0.75;
	--element-disabled-opacity: 0.5;
}

body {
	margin: 0;
	background: var(--background);
	min-height: 100vh;
	width: 100%;
	height: 100%;
	line-height: 2;
}

#app {
	width: 100%;
	height: 100%;
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #eee;
	margin: 0;
	padding: 0;
	display: flex;
}

@media only screen and (max-width: 600px) {
	#app {
		flex-direction: column;
	}
}

*,
*:before,
*:after {
	box-sizing: inherit;
}

.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

::selection {
	background: #ffffff22;
}
</style>
