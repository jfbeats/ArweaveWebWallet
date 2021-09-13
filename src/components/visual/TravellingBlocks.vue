<template>
	<div class="travelling-blocks">
		<div class="footer">
			<div class="bubbles">
				<div class="bubble" v-for="n in nbBlocks" :key="n" :style="`--size:${2+Math.random()*4}rem; --distance:${120+Math.random()*80}px; --position:${-5+Math.random()*110}%; --time:${5+Math.random()*20}s; --delay:${-1*(4+Math.random()*2)}s;`" />
			</div>

		</div>
		<svg style="position:absolute;">
			<defs>
				<filter id="blob">
					<feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
					<feColorMatrix in="blur" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="blob" />
					<feMorphology in="blob" result="mask" operator="erode" radius="1" />
					<feComposite in="blob" in2="mask" operator="out" />
				</filter>
			</defs>
		</svg>
	</div>
</template>

<script>
import InterfaceStore from '@/store/InterfaceStore'
import { computed } from 'vue'

export default {
	setup () {
		const nbBlocks = computed(() => Math.floor(InterfaceStore.windowWidth / 50))
		return { nbBlocks }
	}
}
</script>

<style scoped>
.travelling-blocks {
	--footer-background: #fff;
	width: 100%;
	overflow: hidden;
	pointer-events: none;
}

.footer {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-end;
}

.bubbles {
	height: 1rem;
	width: 120%;
	background: var(--footer-background);
	filter: url("#blob");
}

.bubble {
	position: absolute;
	left: var(--position, 50%);
	background: var(--footer-background);
	animation: bubble-size var(--time, 4s) ease-in infinite var(--delay, 0s),
		bubble-move var(--time, 4s) ease-in infinite var(--delay, 0s);
	transform: translate(-50%, 100%);
}

@keyframes bubble-size {
	0%,
	50% {
		width: var(--size, 4rem);
		height: var(--size, 4rem);
	}
	100% {
		width: 0rem;
		height: 0rem;
	}
}

@keyframes bubble-move {
	0% {
		bottom: -20px;
	}
	100% {
		bottom: var(--distance, 10rem);
	}
}
</style>