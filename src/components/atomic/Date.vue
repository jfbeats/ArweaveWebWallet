<template>
	<span>
		{{ date }} {{ time }}
	</span>
</template>

<script>
import { computed } from 'vue'

export default {
	props: ['timestamp'],
	setup (props) {
		const date = computed(() => new Date(props.timestamp).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }))
		const time = computed(() => new Date(props.timestamp).toLocaleTimeString())
		return { date, time }
	}
}
</script>

<style scoped>
</style>