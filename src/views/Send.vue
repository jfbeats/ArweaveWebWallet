<template>
	<div class="send">
		<Input />
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
}
</style>