<template>
	<teleport to="#viewport" v-if="active">
		<TransitionsManager>
			<div v-if="hasContent && background" class="background" />
		</TransitionsManager>
		<Observer @mutation="setVector" class="container">
			<TransitionsManager appear :vector="vector">
				<slot />
			</TransitionsManager>
		</Observer>
	</teleport>
</template>



<script setup lang="ts">
import TransitionsManager from '@/components/visual/TransitionsManager.vue'
import Observer from '@/components/function/Observer.vue'
import { computed, onMounted, ref, useSlots } from 'vue'

const props = defineProps<{ background?: any }>()
const slots = useSlots()
const active = ref(false)
const vector = ref(0)
const hasContent = computed(() => slots.default?.()?.[0]?.key != null)
const setVector = () => vector.value = hasContent.value ? -1 : 1
setVector()

onMounted(() => active.value = true)
</script>



<style scoped>
.container > :deep(*) {
	position: fixed;
	inset: 0;
}

.background {
	background: #00000088;
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
}
</style>