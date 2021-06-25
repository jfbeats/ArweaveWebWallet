<template>
	<div class="send">
		<!-- to -> (what, amount), data? -->
		<!-- fees -->
		<!-- Autocomplete local addrs -->
		<h2 class="heading"><img src="@/assets/icons/north_east.svg">Send</h2>
		<Input :icon="require('@/assets/icons/person.svg')" placeholder="Arweave address" autocomplete="ar" />
		<!-- QR -->
	</div>
</template>

<script>
import Input from '@/components/atomic/Input.vue'

export default {
	components: { Input },
}
</script>

<style scoped>
.send {
	padding: var(--spacing);
	background: var(--background2);
	border-radius: var(--border-radius);
	border: 1px solid var(--border);
}

.heading {
	display: flex;
	gap: var(--spacing);
}
</style>