<template>
	<teleport to="#viewport">
		<Observer @mutation="setVector" class="container">
			<TransitionsManager appear :vector="vector">
				<slot />
			</TransitionsManager>
		</Observer>
	</teleport>
</template>



<script setup lang="ts">
import TransitionsManager from '@/components/visual/TransitionsManager.vue'
import { ref, useSlots } from 'vue'
import Observer from '@/components/function/Observer.vue'

const slots = useSlots()

const vector = ref(0)
const setVector = () => vector.value = slots.default?.()?.[0]?.key != null ? -1 : 1
setVector()
</script>



<style scoped>
.container > :deep(*) {
	position: fixed;
	inset: 0;
}
</style>