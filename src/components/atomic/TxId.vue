<template>
	<div class="tx-id ellipsis">
		<span class="address-tx ellipsis">
			<strong>
				<slot></slot>
			</strong>
			<span class="id">{{ txId }}</span>
		</span>
	</div>
</template>

<script>
export default {
	props: ['txId']
}
</script>

<style scoped>
.id {
	user-select: all;
}
</style>