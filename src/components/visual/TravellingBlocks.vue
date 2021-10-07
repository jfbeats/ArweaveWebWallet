<template>
	<div class="travelling-blocks">
		<div class="footer">
			<div class="bubbles">
				<div class="bubble" v-for="n in nbBlocks" :key="n" :style="`--size:${5+Math.random()*2}rem; --distance:${120+Math.random()*100}px; --position:${Math.random()*100}%; --time:${4+Math.random()*18}s; --delay:${-1*(4+Math.random()*2)}s;`" />
			</div>
		</div>
		<svg style="position:absolute;">
			<defs>
				<filter id="blob">
					<feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="7" />
					<feColorMatrix in="blur" result="blob" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -11" />
					<feMorphology in="blob" result="mask" operator="erode" radius="2" />
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
		const nbBlocks = computed(() => Math.floor(InterfaceStore.windowWidth / 60))
		return { nbBlocks }
	}
}
</script>

<style scoped>
.travelling-blocks {
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
	position: absolute;
	bottom: -1rem;
	height: 3rem;
	width: 120%;
	background: #ffffff;
	filter: url("#blob");
}

.bubble {
	position: absolute;
	left: var(--position, 50%);
	animation: bubble-size var(--time, 4s) ease-in infinite var(--delay, 0s),
		bubble-move var(--time, 4s) ease-in infinite var(--delay, 0s),
		bubble-opacity var(--time, 4s) ease-in infinite var(--delay, 0s);
	transform: translate(-50%, 100%);
}

@keyframes bubble-size {
	0%,
	50% {
		width: var(--size, 4rem);
		height: var(--size, 4rem);
		border-radius: 50%;
	}
	100% {
		width: 3.5rem;
		height: 3.5rem;
		border-radius: 0;
	}
}

@keyframes bubble-opacity {
	0%,
	90% {
		background: #ffffff;
	}
	100% {
		background: #ffffff00;
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