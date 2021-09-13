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
					<feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
					<feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="blob" />
					<feMorphology in="blob" result="bigblob" operator="dilate" radius="10" />
					<feMorphology in="blob" result="bigblob2" operator="dilate" radius="11" />
					<feComposite in="SourceGraphic" in2="bigblob2" result="result" operator="atop" />
					<feComposite in="result" in2="bigblob" operator="out" />
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
	--background:#111;
    --footer-background:#fff;
	width: 100%;
	opacity: 0.9;
	overflow: hidden;
	position: relative;
}

.footer {
	z-index: 1;
	position: relative;
	grid-area: footer;
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
	border-radius: 100%;
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