<template>
	<svg xmlns='http://www.w3.org/2000/svg' :viewBox="`0 0 ${size + stroke * 2} ${size + stroke * 2}`" :style="style">
		<g style="fill:currentColor; stroke:currentColor;" :style="{ strokeWidth:stroke }" stroke-linejoin="round">
			<rect v-for="rect in rects" :key="rect" :x="rect.x" :y="rect.y" :width="rect.w" :height="rect.h" />
		</g>
	</svg>
</template>

<script>
// Vue component made from https://github.com/stewartlord/identicon.js/
import { addressToColor } from '@/functions/Utils'
import { SHA256 } from 'jshashes'
import { computed } from 'vue'

export default {
	props: ['address'],
	setup (props) {
		const hash = new SHA256
		const addressHash = hash.hex(props.address)
		const size = 5
		const cell = size / 5
		const stroke = size * 0.04
		const style = { color: `rgb(${addressToColor(props.address).join(',')})`, }
		const rects = computed(() => {
			const result = []
			for (let i = 0; i < 15; i++) {
				if (parseInt(addressHash.charAt(i), 16) % 2) { continue }
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
		return { size, stroke, rects, style }
	}
}
</script>