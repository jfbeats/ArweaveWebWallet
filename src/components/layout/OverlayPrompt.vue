<template>
	<TransitionsManager>
		<Link v-if="options" :key="options.message || options.action?.name" class="overlay-prompt flex-column" :class="{ inline }" :run="options.action?.run">
			<div class="content flex-column">
				<Icon v-if="options.icon || options.action?.icon" :icon="options.icon || options.action?.icon" style="font-size: 4em;" />
				<slot />
				<div class="message" v-if="options.message || options.action?.name" >{{ options.message || options.action?.name }}</div>
			</div>
			<div v-if="options.actions?.length" class="actions-container flex-row">
				<Button v-for="action in options.actions" :key="action.name" @click="action.run" :glow="true" color="var(--grey)">{{ action.name }}</Button>
			</div>
		</Link>
	</TransitionsManager>
</template>



<script setup lang="ts">
import Icon from '@/components/atomic/Icon.vue'
import TransitionsManager from '@/components/visual/TransitionsManager.vue'
import Button from '@/components/atomic/Button.vue'
import Link from '@/components/function/Link.vue'

const props = defineProps<{
	options?: {
		icon?: any
		message?: string
		action?: Action
		actions?: Action[]
	}
	inline?: boolean
}>()
</script>



<style scoped>
.overlay-prompt {
	border-radius: inherit;
	width: 100%;
	z-index: 10;
	align-items: center;
	justify-content: space-evenly;
}

.overlay-prompt:not(.inline) {
	background: inherit;
	position: absolute;
	height: 100%;
	inset: 0;
	padding: inherit;
}

.content {
	flex:1 1 auto;
	display:flex;
	flex-direction:column;
	align-items:center;
	justify-content:space-evenly;
	/*margin-bottom:var(--spacing);*/
}

.message {
	text-align: center;
}

.actions-container {
	width: 100%;
}

.button {
	height: 5em;
	font-size: 1.1em;
	width: 100%;
}
</style>