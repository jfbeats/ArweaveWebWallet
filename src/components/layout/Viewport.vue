<template>
	<teleport to="#viewport" v-if="active">
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
import { onMounted, ref, useSlots } from 'vue'

const slots = useSlots()
const active = ref(false)
const vector = ref(0)
const setVector = () => vector.value = slots.default?.()?.[0]?.key != null ? -1 : 1
setVector()

onMounted(() => active.value = true)
</script>



<style scoped>
.container > :deep(*) {
	position: fixed;
	inset: 0;
}
</style>