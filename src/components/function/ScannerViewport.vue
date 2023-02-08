<template>
	<Viewport>
		<Scanner v-if="scanning" />
	</Viewport>
</template>



<script setup lang="ts">
import Viewport from '@/components/layout/Viewport.vue'
import Scanner from '@/components/function/Scanner.vue'
import { scanning } from '@/functions/Scanner'
</script>