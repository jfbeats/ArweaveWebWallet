<template>
	<div class="edit-wallet">
		<div class="card flex-column">
			<WalletsOptions class="" />
			<Button v-if="!canConnect" :to="{ name: 'Wallet', params: { walletId } }">Finish</Button>
		</div>
	</div>
</template>



<script setup lang="ts">
import WalletsOptions from '@/components/composed/WalletsOptions.vue'
import Button from '@/components/atomic/Button.vue'
import { computed } from 'vue'
import { state } from '@/functions/Channels'
import { sharedState } from '@/functions/Connect'
import { useRoute } from '@/router'

const route = useRoute()
const walletId = computed(() => Array.isArray(route.query.wallet) ? route.query.wallet[0] : route.query.wallet)
const canConnect = computed(() => ['popup', 'iframe', 'ws'].includes(state.value.type!) && !sharedState.value?.walletId)
</script>



<style scoped>
.edit-wallet {
	padding: var(--spacing);
	width: 100%;
	max-width: var(--column-width);
}
</style>