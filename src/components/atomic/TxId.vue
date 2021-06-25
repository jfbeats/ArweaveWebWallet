<template>
	<div class="address-container ellipsis">
		<span class="address-tx ellipsis">
			<strong>
				<slot></slot>
			</strong>
			<span class="id">
				{{ txId }}
			</span>
		</span>
	</div>
</template>

<script>
export default {
	props: ['txId']
}
</script>

<style scoped>
.address-container {
}

.address-tx {
}

.id {
	user-select: all;
}
</style>