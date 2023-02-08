<template>
	<div class="edit-wallet">
		<div class="card flex-column">
			<WalletsOptions class="" />
			<Button v-if="!canConnect" to="Wallet">Finish</Button>
		</div>
	</div>
</template>



<script setup lang="ts">
import WalletsOptions from '@/components/composed/WalletsOptions.vue'
import Button from '@/components/atomic/Button.vue'
import { computed } from 'vue'
import { state } from '@/functions/Channels'
import { sharedState } from '@/functions/Connect'

const canConnect = computed(() => ['popup', 'iframe', 'ws'].includes(state.value.type!) && !sharedState.value?.walletId)
</script>



<style scoped>
.edit-wallet {
	padding: var(--spacing);
	width: 100%;
}
</style>