<template>
	<div class="address-container ellipsis">
		<span class="address-tx ellipsis">
			<strong>
				<slot></slot>
			</strong>
			{{ txId }}
		</span>
	</div>
</template>

<script>
export default {
	props: ['txId']
}
</script>

<style scoped>
mat-icon {
	font-size: inherit;
}

a {
	color: inherit;
	cursor: pointer;
}

.address-container {
}

.address-tx {
}
</style>