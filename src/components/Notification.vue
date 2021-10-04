<template>
	<div class="notification">
		<div class="flex-column">
			<div class="flex-row">
				<IconBackground :icon="icon || require('@/assets/icons/notification.svg')" :img="img" />
			</div>
			<div class="flex-row">
				Actions
			</div>
		</div>
	</div>
</template>



<script>
import IconBackground from '@/components/atomic/IconBackground.vue'

export default {
	components: { IconBackground },
	props: ['icon', 'img'],
	setup () {

	}
}
</script>



<style scoped>
</style>