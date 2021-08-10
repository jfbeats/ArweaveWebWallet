<template>
	<div class="tx-icon" :class="{ isPending }" :style="styleObject">
		<svg v-if="direction==='in' && !isData" fill="currentColor" class="tx-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
			<rect x="0" y="0" width="24" height="24" style="fill:none;fill-rule:nonzero;" />
			<g transform="matrix(6.12323e-17,1,-1,6.12323e-17,24,0)">
				<path d="M16.01,11L4,11L4,13L16.01,13L16.01,16L20,12L16.01,8L16.01,11Z" style="fill-rule:nonzero;" />
			</g>
		</svg>
		<svg v-else-if="direction==='out' && !isData" fill="currentColor" class="tx-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
			<rect x="0" y="0" width="24" height="24" style="fill:none;fill-rule:nonzero;" />
			<g transform="matrix(6.12323e-17,-1,1,6.12323e-17,0,24)">
				<path d="M16.01,11L4,11L4,13L16.01,13L16.01,16L20,12L16.01,8L16.01,11Z" style="fill-rule:nonzero;" />
			</g>
		</svg>
		<svg v-else-if="direction==='in' && !isValue" fill="currentColor" class="tx-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
			<path d="M0 0h24v24H0V0z" fill="none" />
			<path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.56.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3zm-5.55-8h-2.9v3H8l4 4 4-4h-2.55z" />
		</svg>
		<svg v-else-if="direction==='out' && !isValue" fill="currentColor" class="tx-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
			<path d="M0 0h24v24H0V0z" fill="none" />
			<path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.56.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3zM8 13h2.55v3h2.9v-3H16l-4-4z" />
		</svg>
		<svg v-else-if="direction==='in'" fill="currentColor" class="tx-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
			<g>
				<rect fill="none" height="24" width="24" />
				<path d="M12,4c4.41,0,8,3.59,8,8s-3.59,8-8,8s-8-3.59-8-8S7.59,4,12,4 M12,2C6.48,2,2,6.48,2,12c0,5.52,4.48,10,10,10 c5.52,0,10-4.48,10-10C22,6.48,17.52,2,12,2L12,2z M13,12l0-4h-2l0,4H8l4,4l4-4H13z" />
			</g>
		</svg>
		<svg v-else-if="direction==='out'" fill="currentColor" class="tx-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
			<g>
				<rect fill="none" height="24" width="24" />
				<path d="M12,20c-4.41,0-8-3.59-8-8s3.59-8,8-8s8,3.59,8,8S16.41,20,12,20 M12,22c5.52,0,10-4.48,10-10c0-5.52-4.48-10-10-10 C6.48,2,2,6.48,2,12C2,17.52,6.48,22,12,22L12,22z M11,12l0,4h2l0-4h3l-4-4l-4,4H11z" />
			</g>
		</svg>
		<transition name="fade">
			<Icon v-if="isPending || uploadProgress" icon="loader" :progress="uploadProgress" class="loader"></Icon>
		</transition>
	</div>
</template>



<script>
import Icon from '@/components/atomic/Icon.vue'
import ArweaveStore from '@/store/ArweaveStore'

export default {
	components: { Icon },
	props: ['tx', 'direction'],
	computed: {
		isData () { return this.tx.data.size != 0 },
		isValue () { return this.tx.quantity.winston != 0 },
		isPending () { return !this.tx.block },
		uploadProgress () { return ArweaveStore.uploads[this.tx.id]?.upload },
		styleObject () {
			return { 'color': this.isData && !this.isValue ? 'var(--orange)' : this.direction === 'in' ? 'var(--green)' : 'var(--red)' }
		},
	},
}
</script>



<style scoped>
.tx-icon {
	position: relative;
}

.tx-svg {
	padding: 8px;
	width: 100%;
	height: 100%;
	transition: padding 0.4s ease;
}

.isPending .tx-svg {
	padding: 25%;
}

.loader {
	width: 48px;
	height: 48px;
}

.loader {
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
}
</style>