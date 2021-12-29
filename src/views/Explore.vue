<template>
	<div class="settings">
		<div class="column">
			<Input v-model="search" placeholder="Search" style="flex:1 1 0;" @keyup.enter="" />
			<div class="group">
				<p>Gateway</p>
				<div class="flex-row">
				</div>
			</div>
			<div class="group">
				<p>Currency</p>
			</div>
		</div>
	</div>
</template>



<script setup>
import Input from '@/components/atomic/Input.vue'
import Select from '@/components/atomic/Select.vue'
import Button from '@/components/atomic/Button.vue'
import ArweaveStore from '@/store/ArweaveStore'
import { reactive, ref, computed } from 'vue'

import LogoArweave from '@/assets/logos/arweave.svg?component'

const search = ref('')



</script>



<style scoped>
.settings {
	padding: var(--spacing);
	min-height: var(--current-vh);
	width: 100%;
	display: flex;
	justify-content: center;
	background: var(--background2);
}

.column {
	width: 100%;
	max-width: var(--column-width);
}

.group {
	margin-bottom: 3em;
}

.wallet-options {
	border-radius: var(--border-radius);
}
</style>