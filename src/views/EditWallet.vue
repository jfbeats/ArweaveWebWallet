<template>
	<div class="edit-wallet">
		<WalletsOptions class="card" />
	</div>
</template>



<script setup lang="ts">
import WalletsOptions from '@/components/composed/WalletsOptions.vue'
</script>



<style scoped>
.edit-wallet {
	padding: var(--spacing);
	width: 100%;
}
</style>