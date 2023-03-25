<template>
	<div class="cloud-line">
		<div class="container" :style="{height: height+'vh', fill: color}">
			<div v-for="(cloud, i) in cloudsData" :key="i" :style="{height: cloud.height+'px', width: cloud.width+'px', left: (containerWidthPx / 2 + cloud.offsetX)+'px'}" class="cloud">
				<div v-html="cloudsList[cloud.svgIndex].data" :class="{fliph: cloud.fliph}" class="cloud-data"></div>
			</div>
			<div class="cloud-bottom" :style="{background: color}"></div>
		</div>
	</div>
</template>



<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { normalizeColorTo } from '@/store/Theme'

const props = defineProps<{
	height?: number
	minHeight?: number
	color?: string
	seed?: number
}>()

const height = computed(() => props.height ?? 20)
const minHeight = computed(() => props.minHeight ?? 0.3)
const color = computed(() => normalizeColorTo('hex', props.color ?? '#ffffff'))
const seed = computed(() => props.seed ?? Math.floor(Math.random() * 100000))

const cloudsList = ref([
	{ name: 'cloud1.svg', ratio: 2.3, data: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 57.927509 25.399996" preserveAspectRatio="none" width="100%" height="100%"> <g id="layer1" transform="translate(-51.167201,-68.942858)"> <path d="m 109.09471,94.342854 c 0,0 0,-2.76368 0,-4.49368 0,-3.71475 -3.0113,-6.72571 -6.72571,-6.72571 -0.41344,0 -0.81598,0.0427 -1.20825,0.11393 0.12171,-0.58666 0.18627,-1.19415 0.18627,-1.81785 0,-4.91667 -3.986744,-8.902696 -8.903414,-8.902696 -1.61608,0 -3.13021,0.43214 -4.43654,1.18496 -1.52611,-2.83315 -4.51908,-4.75895 -7.96253,-4.75895 -3.506971,0 -6.544732,1.99882 -8.043702,4.9177 -1.289738,-0.84912 -2.832444,-1.34371 -4.491567,-1.34371 -3.888658,0 -7.14162,2.7132 -7.974176,6.349996 -4.638323,0.10266 -8.36789,3.89149 -8.36789,8.55485 v 6.92116" id="path98" /> </g> </svg>` },
	{ name: 'cloud2.svg', ratio: 2, data: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32.456276 15.99179" preserveAspectRatio="none" width="100%" height="100%"> <g id="layer1" transform="translate(-89.605225,-140.17077)"> <path d="m 122.0411,156.16256 c 0.008,-0.13653 0.0204,-0.27236 0.0204,-0.411 0,-3.5433 -2.81376,-6.42372 -6.32777,-6.54474 0.0977,-0.34994 0.15417,-0.71718 0.15417,-1.09855 0,-2.23977 -1.8161,-4.05693 -4.05696,-4.05693 -0.55737,0 -1.08866,0.11324 -1.57232,0.31644 -0.53339,-2.40064 -2.67194,-4.19701 -5.23345,-4.19701 -2.96299,0 -5.365064,2.40279 -5.365064,5.36541 v 0.0159 c -0.106177,-0.007 -0.211666,-0.0159 -0.319616,-0.0159 -2.185803,0 -3.993436,1.5988 -4.329986,3.68969 -0.176742,-0.019 -0.3556,-0.0307 -0.537633,-0.0307 -2.688167,0 -4.867646,2.17911 -4.867646,4.86693 0,0.75319 0,2.10046 0,2.10046 l 32.435115,-1e-5" id="path90" /> </g> </svg>` },
	{ name: 'cloud3.svg', ratio: 1.7, data: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34.79623 19.81941" preserveAspectRatio="none" width="100%" height="100%"> <g id="layer1" transform="translate(-88.43522,-138.25696)"> <path d="m 123.23145,158.07637 c 0,0 0,-3.42231 0,-5.70159 0,-4.01637 -3.13267,-7.29262 -7.08732,-7.53993 -0.75493,-3.75179 -4.06752,-6.57789 -8.03979,-6.57789 -4.32154,0 -7.85812,3.33976 -8.177737,7.57696 -2.066237,0.48365 -3.731339,1.99672 -4.429125,3.97157 -0.57785,-0.2219 -1.202981,-0.34784 -1.858804,-0.34784 -2.873375,0 -5.203454,2.32939 -5.203454,5.20348 0,1.30844 0,3.41524 0,3.41524" id="path94" /> </g> </svg>` },
	{ name: 'cloud4.svg', ratio: 2.4, data: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 49.581154 20.931721" preserveAspectRatio="none" width="100%" height="100%"> <g id="layer1" transform="translate(-81.042757,-137.70081)"> <path d="m 130.62391,153.59629 c 0,-4.18291 -3.3909,-7.57415 -7.5738,-7.57415 -1.15816,0 -2.25177,0.26776 -3.23321,0.73237 -0.20918,-5.03555 -4.35573,-9.0537 -9.44243,-9.0537 -3.89397,0 -7.23688,2.35585 -8.68505,5.71889 -0.94895,-0.36796 -1.980486,-0.57256 -3.060338,-0.57256 -4.18465,0 -7.6581,3.03707 -8.341783,7.02662 -0.67169,-0.21024 -1.386417,-0.32385 -2.126898,-0.32385 -3.931002,0 -7.117644,3.18664 -7.117644,7.11766 0,0.68263 0,1.96496 0,1.96496 h 49.581153" id="path104" /> </g> </svg>` },
	{ name: 'cloud5.svg', ratio: 2.3, data: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45.668137 20.10833" preserveAspectRatio="none" width="100%" height="100%"> <g id="layer1" transform="translate(-82.999262,-138.1125)"> <path id="path3" d="M 82.999262,158.22083 H 128.6674 l 0,-4.34657 c 0,-3.65302 -2.96158,-6.61458 -6.61458,-6.61458 -0.67664,0 -1.32998,0.103 -1.94453,0.29172 -0.45754,-2.55693 -2.68779,-4.50003 -5.37633,-4.50003 -0.68932,0 -1.3462,0.13301 -1.95331,0.36513 -1.45275,-3.1309 -4.62212,-5.304 -8.30123,-5.304 -3.69075,0 -6.868925,2.18686 -8.314608,5.33506 -0.640662,-0.25294 -1.336675,-0.39619 -2.067639,-0.39619 -2.448269,0 -4.526148,1.5621 -5.308256,3.74121 -3.259296,0.3909 -5.787655,3.16055 -5.787655,6.525" /> </g> </svg>` },
	{ name: 'cloud6.svg', ratio: 2.2, data: `<svg xmlns="http://www.w3.org/2000/svg" height="100%" width="100%" preserveAspectRatio="none" viewBox="0 0 43.690807 19.7866"> <g transform="translate(-83.987931,-138.27372)" id="layer1"> <path id="path110" d="m 83.987931,158.06032 h 43.690809 l 0,-5.76388 c 0,-3.22085 -2.61054,-5.83247 -5.83142,-5.83247 -0.0106,0 -0.0212,0.003 -0.0282,0.003 -0.28223,-2.96016 -2.77283,-5.27648 -5.80321,-5.27648 -1.2065,0 -2.32479,0.36581 -3.25612,0.99234 -1.22064,-2.32267 -3.65092,-3.90911 -6.45584,-3.90911 -1.55787,0 -2.99863,0.49281 -4.18359,1.32503 -1.15219,-0.8301 -2.562599,-1.32503 -4.091177,-1.32503 -3.711919,0 -6.742298,2.8857 -6.988519,6.53555 -3.933481,0.23847 -7.052733,3.49533 -7.052733,7.48877" /> </g> </svg>` },
	{ name: 'cloud7.svg', ratio: 2, data: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36.09269 17.365129" preserveAspectRatio="none" width="100%" height="100%"> <g id="layer1" transform="translate(-87.78699,-139.4841)"> <path d="m 123.87968,154.19247 c 0,-3.13301 -2.11315,-5.7658 -4.99182,-6.56555 -0.98777,-2.37384 -3.28083,-4.06046 -5.9831,-4.18322 -1.08302,-2.33575 -3.4431,-3.9596 -6.18773,-3.9596 -2.12725,0 -4.02871,0.97544 -5.27754,2.50367 -0.70556,-0.24659 -1.456981,-0.387 -2.247212,-0.387 -2.755185,0 -5.125852,1.6383 -6.201833,3.99203 -2.9845,0.72567 -5.203455,3.40995 -5.203455,6.62025 0,1.79281 0,4.63618 0,4.63618 h 36.09269" id="path114" /> </g> </svg>` },
	{ name: 'cloud8x2.svg', ratio: 3.3, data: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 104.79511 31.396891" preserveAspectRatio="none" width="100%" height="100%"> <g id="layer1" transform="translate(-53.435778,-132.46822)"> <path d="m 158.23089,161.90013 c 0,-3.25615 -2.14135,-6.01133 -5.09059,-6.93915 0.35277,-0.9172 0.54682,-1.91204 0.54682,-2.95275 0,-4.55435 -3.69359,-8.24828 -8.24796,-8.24828 -0.65263,0 -1.28411,0.0779 -1.89442,0.22048 -0.90662,-6.50523 -6.4911,-11.51221 -13.24433,-11.51221 -5.45854,0 -10.15047,3.27097 -12.23081,7.95761 -1.2908,-0.83714 -2.82856,-1.32503 -4.48167,-1.32503 -4.17725,0 -7.62741,3.10586 -8.1714,7.13459 -1.22555,-0.9398 -2.75415,-1.5046 -4.41854,-1.5046 -4.01886,0 -7.276754,3.25932 -7.276754,7.27744 0,0.47273 0.04868,0.93134 0.134065,1.37584 -1.095031,0.381 -2.070471,1.01248 -2.8575,1.82739 -1.3081,-1.93323 -3.520731,-3.20323 -6.030384,-3.20323 -0.861853,0 -1.685237,0.15875 -2.452528,0.4304 -0.276225,-3.76415 -3.411697,-6.73629 -7.248869,-6.73629 -2.240836,0 -4.243203,1.01423 -5.577761,2.60527 -1.063281,-0.60679 -2.290948,-0.95956 -3.603625,-0.95956 -3.739806,0 -6.817095,2.82223 -7.227014,6.45231 -3.118564,0.82196 -5.421842,3.65477 -5.421842,7.03085 0,1.08302 0,3.0339 0,3.0339 H 158.23089" id="path116" /> </g> </svg>` },
	{ name: 'cloud9x3.svg', ratio: 6.7, data: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 185.13637 27.84123" preserveAspectRatio="none" width="100%" height="100%"> <g id="layer1" transform="translate(-16.288958,-114.59129)"> <path d="m 201.42522,142.43252 c -0.5715,-5.03414 -4.84013,-8.94643 -10.02596,-8.94643 -0.63146,0 -1.24883,0.06 -1.84854,0.17285 -0.99838,-1.05833 -2.22604,-1.89794 -3.60188,-2.44475 0.0671,-0.47273 0.10584,-0.95956 0.10584,-1.45344 0,-5.57389 -4.51909,-10.09298 -10.09296,-10.09298 -3.46781,0 -6.52288,1.74977 -8.34321,4.40973 -1.13242,-0.44098 -2.3636,-0.68439 -3.65125,-0.68439 -3.6336,0 -6.81567,1.9191 -8.59367,4.79777 -0.52562,0.17991 -1.03362,0.39864 -1.51693,0.65616 -1.16769,-1.95791 -2.97744,-3.48543 -5.14139,-4.29329 -1.76741,-2.92806 -4.9784,-4.88598 -8.64658,-4.88598 -2.86351,0 -5.44618,1.19592 -7.28345,3.1115 -0.89252,-0.26106 -1.83481,-0.40216 -2.81022,-0.40216 -3.26496,0 -6.16585,1.55223 -8.01089,3.95816 -1.66617,-1.21356 -3.71687,-1.93323 -5.93654,-1.93323 -0.81457,0 -1.60515,0.0988 -2.3636,0.28223 -1.85174,-2.20485 -4.62669,-3.60539 -7.73044,-3.60539 -4.3688,0 -8.089187,2.77637 -9.49394,6.66046 -2.368206,-1.93675 -5.394325,-3.10092 -8.69315,-3.10092 -5.81697,0 -10.785475,3.61596 -12.78927,8.72419 -0.442727,-3.2244 -3.200744,-5.71148 -6.545421,-5.71148 -0.5842,0 -1.147604,0.0847 -1.686984,0.22579 0.0026,-0.0741 0.01138,-0.14817 0.01138,-0.22579 0,-3.72179 -3.017309,-6.73804 -6.738753,-6.73804 -2.080683,0 -3.940175,0.94543 -5.175964,2.4271 -0.137213,-0.0706 -0.276569,-0.13758 -0.417327,-0.20108 0.02408,-0.25048 0.03704,-0.50448 0.03704,-0.762 -10e-7,-4.29684 -3.486151,-7.78582 -7.787217,-7.78582 -3.529172,0 -6.50838,2.3495 -7.464055,5.56684 -0.934164,-0.41627 -1.967098,-0.65617 -3.057181,-0.65617 -3.81776,0 -6.96242,2.8575 -7.430204,6.54756 -0.182033,-0.0106 -0.365831,-0.0212 -0.551391,-0.0212 -4.408313,0 -7.981599,3.57365 -7.981599,7.98336 0,0.70556 0.09243,1.38996 0.264584,2.03906 -2.408415,0.8114 -4.14514,3.08327 -4.14514,5.7644 0,0.20812 0,0.61738 0,0.61738 l 185.136372,-3e-5" id="path122" /> </g> </svg>` },
	{ name: 'cloud10x2.svg', ratio: 4, data: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 101.84059 24.694441" preserveAspectRatio="none" width="100%" height="100%"> <g id="layer1" transform="translate(-67.008281,-114.65278)"> <path d="m 168.84887,136.82846 c 0,-4.02166 -2.52342,-7.45082 -6.07236,-8.7984 -1.02589,-4.0886 -4.72334,-7.11549 -9.1285,-7.11549 -4.26894,0 -7.87188,2.84332 -9.0244,6.73806 -0.67205,-0.15173 -1.37017,-0.23632 -2.0881,-0.23632 -1.20472,0 -2.35547,0.22931 -3.41418,0.64201 -1.476,-3.26678 -4.76144,-5.54561 -8.58025,-5.54561 -3.78532,0 -7.04638,2.23652 -8.54109,5.46089 -1.4083,-0.84312 -3.05401,-1.32638 -4.81296,-1.32638 -1.99567,0 -3.84458,0.62439 -5.36752,1.68272 -1.48236,-3.25257 -4.75933,-5.51397 -8.56719,-5.51397 -1.35995,0 -2.65149,0.28943 -3.819177,0.80799 -2.936161,-5.34819 -8.619411,-8.97118 -15.150393,-8.97118 -9.540523,0 -17.274469,7.73285 -17.274469,17.27549 0,2.65645 0,7.41895 0,7.41895 H 168.84887" id="path128" /> </g> </svg>` },
	{ name: 'cloud11x2.svg', ratio: 2.6, data: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 76.552849 28.92779" preserveAspectRatio="none" width="100%" height="100%"> <g id="layer1" transform="translate(-67.556859,-133.70281)"> <path d="m 67.556859,162.6306 h 76.552851 c 0,0 0,-1.56633 0,-2.46946 0,-2.72695 -2.21157,-4.93887 -4.93889,-4.93887 -0.25647,0 -0.50659,0.0282 -0.75177,0.0635 -0.99342,-2.91748 -3.75321,-5.02356 -7.00934,-5.02356 -0.59867,0 -1.17758,0.0776 -1.73532,0.21166 -0.50906,-4.75191 -4.44817,-8.47373 -9.29287,-8.64658 -1.78153,-4.74485 -6.35846,-8.12448 -11.72598,-8.12448 -5.27438,0 -9.784291,3.26321 -11.630024,7.87755 -2.005471,-1.82388 -4.670849,-2.93865 -7.596434,-2.93865 -5.077812,0 -9.371364,3.35491 -10.790732,7.96573 -0.798584,-0.24696 -1.647436,-0.381 -2.52663,-0.381 -4.724612,0 -8.554861,3.83117 -8.554861,8.55485" id="path132" /> </g> </svg>` },
])
const cloudsData = ref([] as { svgIndex: number, offsetX: number, height: number, width: number, fliph: number }[])
const randomCounter = ref(0)
const containerHeightPx = ref(0)
const containerWidthPx = ref(0)

const eventHandler = () => requestAnimationFrame(update)
onMounted(() => {
	update()
	window.addEventListener('resize', eventHandler)
})
onBeforeUnmount(() => {
	window.removeEventListener('resize', eventHandler)
})
const update = () => {
	containerHeightPx.value = Math.floor(height.value * (Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)) / 100)
	containerWidthPx.value = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
	insertClouds()
}
const insertClouds = () => {
	cloudsData.value = []
	randomCounter.value = 0
	const maxOffset = containerWidthPx.value * 0.6
	let lastLeft, lastRight
	for (let i = 0; i < 100; i++) {
		const isPlacedRight = i % 2
		let cloudsListIndex = randomCloudIndex() // todo was const??
		if (maxOffset > (isPlacedRight ? cloudsMax() : Math.abs(cloudsMin()))) {
			if (cloudsListIndex === (isPlacedRight ? lastRight : lastLeft)) { cloudsListIndex = randomCloudIndex() }
			cloudsData.value.push(insertCloud(cloudsListIndex, isPlacedRight))
			isPlacedRight ? lastRight = cloudsListIndex : lastLeft = cloudsListIndex
		} else if (maxOffset < (isPlacedRight ? Math.abs(cloudsMin()) : cloudsMax())) { break }
	}
}
const insertCloud = (cloudsListIndex: number, isPlacedRight: number) => {
	const cloud = cloudsList.value[cloudsListIndex]
	const cloudStart = isPlacedRight ? cloudsMax() : cloudsMin()
	const heightRange = Math.abs(cloudStart) / (containerWidthPx.value / 2)
	const height = containerHeightPx.value * (minHeight.value + (Math.pow(heightRange, 1.4) * (1 - minHeight.value)))
	const width = (height * cloud.ratio) * (randomSeeded() * 0.2 + 0.9)
	const offsetOverlap = height * 0.6 * (randomSeeded() * 0.2 + 0.9)
	const distance = (width / 2 - offsetOverlap) * (isPlacedRight ? 1 : -1)
	const offsetX = cloudStart + (cloudsData.value.length === 0 ? 0 : distance)
	const cloudData = { svgIndex: cloudsListIndex, offsetX: offsetX, height: height, width: width, fliph: Math.round(randomSeeded()) }
	return cloudData
}
const cloudsMax = () => {
	return Math.max(...cloudsData.value.map(o => o.offsetX + o.width / 2), 0)
}
const cloudsMin = () => {
	return Math.min(...cloudsData.value.map(o => o.offsetX - o.width / 2), 0)
}
const randomSeeded = () => {
	const x = Math.sin(seed.value + randomCounter.value++) * 10000
	return x - Math.floor(x)
}
const randomCloudIndex = () => {
	return Math.floor(randomSeeded() * cloudsList.value.length)
}
</script>



<style scoped>
.container {
	width: 100%;
	height: 100%;
	position: absolute;
	bottom: 0;
	overflow: hidden;
	filter: drop-shadow(0 0 40px #ffffff44);
}
.cloud {
	position: absolute;
	bottom: 0;
	transform: translateX(-50%);
}
.cloud-data {
	width: 100%;
	height: 100%;
	/* filter: drop-shadow(0 0 40px #ffffff44); */
	/* display: flex; */
}
.cloud-bottom {
	position: absolute;
	width: 100%;
	height: 2px;
	bottom: 0;
}
.fliph {
	transform: scaleX(-1);
	filter: fliph;
}
</style>