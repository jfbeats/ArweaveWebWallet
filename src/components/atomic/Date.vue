<template>
	<span>{{ date }} {{ time }}</span>
</template>



<script setup>
import { computed } from 'vue'

const props = defineProps(['timestamp'])

const date = computed(() => new Date(props.timestamp).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }))
const time = computed(() => new Date(props.timestamp).toLocaleTimeString())
</script>