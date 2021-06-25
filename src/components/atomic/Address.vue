<template>
	<div class="address-container ellipsis">
		<span class="address-tx ellipsis">
			<strong>
				<slot></slot>
			</strong>
			<span class="address">
				{{ address }}
			</span>
		</span>
	</div>
</template>

<script>
export default {
	props: ['address']
}
</script>

<style scoped>
.address-container {
}

.address-tx {
}

.address {
	user-select: all;
}
</style>