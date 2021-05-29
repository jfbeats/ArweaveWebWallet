<template>
	<span>
		<svg v-if="direction==='in' && !isData" class="tx-in" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
			<path d="M0 0h24v24H0V0z" fill="none" />
			<path d="M19 9h-4V3H9v6H5l7 7 7-7zm-8 2V5h2v6h1.17L12 13.17 9.83 11H11zm-6 7h14v2H5z" />
		</svg>
		<svg v-else-if="direction==='out' && !isData" class="tx-out" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
			<path d="M0 0h24v24H0V0z" fill="none" />
			<path d="M9 16h6v-6h4l-7-7-7 7h4v6zm3-10.17L14.17 8H13v6h-2V8H9.83L12 5.83zM5 18h14v2H5z" />
		</svg>
		<svg v-else-if="direction==='in' && !isValue" class="tx-data" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
			<path d="M0 0h24v24H0V0z" fill="none" />
			<path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.56.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3zm-5.55-8h-2.9v3H8l4 4 4-4h-2.55z" />
		</svg>
		<svg v-else-if="direction==='out' && !isValue" class="tx-data" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
			<path d="M0 0h24v24H0V0z" fill="none" />
			<path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.56.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3zM8 13h2.55v3h2.9v-3H16l-4-4z" />
		</svg>
		<svg v-else-if="direction==='in'" class="tx-in" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
			<rect x="0" y="0" width="24" height="24" style="fill:none;fill-rule:nonzero;" />
			<g id="download.svg" transform="matrix(1,0,0,1,12,12)">
				<g transform="matrix(1,0,0,1,-12,-12)">
					<rect x="0" y="0" width="24" height="24" style="fill:none;fill-rule:nonzero;" />
					<path d="M19,9L15,9L15,3L9,3L9,9L5,9L12,16L19,9ZM11,11L11,5L13,5L13,11L14.17,11L12,13.17L9.83,11L11,11ZM5,18L19,18L19,20L5,20L5,18Z" style="fill-rule:nonzero;" />
				</g>
			</g>
			<g id="cloud.svg" transform="matrix(0.998069,0,0,0.998248,11.9942,8.0253)">
				<g transform="matrix(1,0,0,1,-12,-12)">
					<rect x="0" y="0" width="24" height="24" style="fill:none;fill-rule:nonzero;" />
					<path d="M12,6C14.62,6 16.88,7.86 17.39,10.43L17.69,11.93L19.22,12.04C20.78,12.14 22,13.45 22,15C22,16.65 20.65,18 19,18L6,18C3.79,18 2,16.21 2,14C2,11.95 3.53,10.24 5.56,10.03L6.63,9.92L7.13,8.97C8.08,7.14 9.94,6 12,6M12,4C9.11,4 6.6,5.64 5.35,8.04C2.34,8.36 0,10.91 0,14C0,17.31 2.69,20 6,20L19,20C21.76,20 24,17.76 24,15C24,12.36 21.95,10.22 19.35,10.04C18.67,6.59 15.64,4 12,4Z" style="fill-rule:nonzero;" />
				</g>
			</g>
		</svg>
		<svg v-else-if="direction==='out'" class="tx-out" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
			<rect x="0" y="0" width="24" height="24" style="fill:none;fill-rule:nonzero;" />
			<path d="M9,16L15,16L15,10L19,10L12,3L5,10L9,10L9,16ZM12,5.83L14.17,8L13,8L13,14L11,14L11,8L9.83,8L12,5.83ZM5,18L19,18L19,20L5,20L5,18Z" style="fill-rule:nonzero;" />
			<g id="cloud.svg" transform="matrix(0.998069,0,0,0.998248,11.9942,8.0253)">
				<g transform="matrix(1,0,0,1,-12,-12)">
					<rect x="0" y="0" width="24" height="24" style="fill:none;fill-rule:nonzero;" />
					<path d="M12,6C14.62,6 16.88,7.86 17.39,10.43L17.69,11.93L19.22,12.04C20.78,12.14 22,13.45 22,15C22,16.65 20.65,18 19,18L6,18C3.79,18 2,16.21 2,14C2,11.95 3.53,10.24 5.56,10.03L6.63,9.92L7.13,8.97C8.08,7.14 9.94,6 12,6M12,4C9.11,4 6.6,5.64 5.35,8.04C2.34,8.36 0,10.91 0,14C0,17.31 2.69,20 6,20L19,20C21.76,20 24,17.76 24,15C24,12.36 21.95,10.22 19.35,10.04C18.67,6.59 15.64,4 12,4Z" style="fill-rule:nonzero;" />
				</g>
			</g>
		</svg>
	</span>
</template>

<script>
export default {
	props: ['direction', 'isValue', 'isData'],
}
</script>

<style scoped>
.tx-in {
	fill: #a3be8c !important;
}

.tx-out {
	fill: #bf616a !important;
}

.tx-data {
	fill: #d08770 !important;
}
</style>