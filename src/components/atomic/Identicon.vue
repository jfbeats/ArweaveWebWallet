<template>
	<svg xmlns="http://www.w3.org/2000/svg" :viewBox="`0 0 ${size + stroke * 2} ${size + stroke * 2}`" :style="style">
		<g style="fill:currentColor; stroke:currentColor;" :style="{ strokeWidth: stroke }" stroke-linejoin="round">
			<rect v-for="rect in rects" :key="rect" :x="rect.x" :y="rect.y" :width="rect.w" :height="rect.h" />
		</g>
	</svg>
</template>



<script setup lang="ts">
// Vue component made from https://github.com/stewartlord/identicon.js/
// from a SHA-256 hash of the arweave address
import { addressToHash } from '@/functions/Utils'
import { computed, ref, watch } from 'vue'
import { addressHashToColor } from '@/store/Theme'

const props = defineProps<{ address: string }>()

const size = 5
const cell = size / 5
const stroke = size * 0.04
const addressHash = ref(undefined as undefined | string)
watch(() => props.address, async (val) => addressHash.value = await addressToHash(val), { immediate: true })
const style = computed(() => ({
	color: `rgb(${addressHashToColor(addressHash.value).join(',')})`,
}))
const rects = computed(() => {
	const result = [] as any[]
	if (!addressHash.value) { return result }
	for (let i = 0; i < 15; i++) {
		if (parseInt(addressHash.value.charAt(i), 16) % 2) { continue }
		if (i < 5) {
			result.push({ x: 2 * cell + stroke, y: i * cell + stroke, w: cell, h: cell })
		} else if (i < 10) {
			result.push({ x: 1 * cell + stroke, y: (i - 5) * cell + stroke, w: cell, h: cell })
			result.push({ x: 3 * cell + stroke, y: (i - 5) * cell + stroke, w: cell, h: cell })
		} else if (i < 15) {
			result.push({ x: 0 * cell + stroke, y: (i - 10) * cell + stroke, w: cell, h: cell })
			result.push({ x: 4 * cell + stroke, y: (i - 10) * cell + stroke, w: cell, h: cell })
		}
	}
	return result
})
</script>