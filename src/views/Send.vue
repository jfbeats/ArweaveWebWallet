<template>
	<div class="send card">
		<!-- Autocomplete local addrs -->
		<h2 class="heading"><img class="img" src="@/assets/icons/north_east.svg">Send</h2>
		<Input :icon="require('@/assets/icons/person.svg')" placeholder="Arweave address" autocomplete="ar" />
		<span class="row"><h3 class="heading">Amount</h3><div class="secondary">Max</div></span>
		<InputAr />
		<h3 class="heading">Data</h3>
		<!-- data upload handlers -->
		<InputData />
		<!-- display: fees -->
		<!-- submit -->
		<!-- QR -->
	</div>
</template>

<script>
import Input from '@/components/atomic/Input.vue'
import InputAr from '@/components/atomic/InputAr.vue'
import InputData from '@/components/atomic/InputData.vue'

export default {
	components: { Input, InputAr, InputData },
}
</script>

<style scoped>
.send {
	padding-top: 0;
}

.heading {
	margin-top: calc(var(--spacing) * 2);
	display: flex;
	align-items: center;
	gap: var(--spacing);
}

.row {
	display: flex;
	align-items: baseline;
	justify-content: space-between;
}

.img {
	height: 1em;
}

.secondary {
	color: var(--element-secondary);
	cursor: pointer;
}
</style>