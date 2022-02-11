<template>
	<div class="address ellipsis">
		<span class="address-tx ellipsis" @click="tools = !tools">
			<slot />
			<span class="text ellipsis">{{ address }}</span>
			<Icon :icon="IconVerify" v-if="arverify?.verified" class="arverify" />
		</span>
	</div>
</template>



<script setup lang="ts">
import Icon from '@/components/atomic/Icon.vue'
import ProfileStore, { getArverify } from '@/store/ProfileStore'
import { computed, watch, ref } from 'vue'
import IconVerify from '@/assets/icons/verify.svg?component'

const props = defineProps(['address', 'tx'])

const arverify = computed(() => ProfileStore.arverify[props.address])
watch(() => props.address, async () => {
	getArverify(props.address)
}, { immediate: true })

const tools = ref(false)
</script>



<style scoped>
.address {
	display: inline-flex;
}

.address-tx {
	display: inline-flex;
	align-items: center;
}

.text {
	flex: 1 1 0;
	font-family: monospace, monospace;
	font-size: 1em;
	user-select: all;
}

.arverify {
	margin-inline-start: 4px;
}
</style>