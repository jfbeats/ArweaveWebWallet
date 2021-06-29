<template>
	<div class="address ellipsis">
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
.address {
	user-select: all;
}
</style>