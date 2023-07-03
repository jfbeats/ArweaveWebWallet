<template>
	<Observer ref="root" class="loader-block" @intersection="i => visible = i.isIntersecting">
		<Icon v-if="visible" :icon="icon || 'loader'" />
	</Observer>
</template>



<script setup lang="ts">
import Icon from '@/components/atomic/Icon.vue'
import Observer from '@/components/function/Observer.vue'
import { computed, ref } from 'vue'

const props = defineProps<{
	icon?: any
	minHeight?: string
}>()
const root = ref(undefined as undefined | HTMLElement)

const visible = ref(false)
</script>



<style scoped>
.loader-block {
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 4em;
	color: #ffffff66;
}
</style>