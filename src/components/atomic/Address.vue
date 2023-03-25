<template>
	<div class="address ellipsis">
		<span class="address-tx ellipsis">
			<slot />
			<span class="text ellipsis">{{ val }}</span>
			<Tooltip v-if="arverify?.verified" class="icon-container" content="verified">
				<Icon :icon="ICON.verify" />
			</Tooltip>
			<Tooltip v-if="clipboard" class="icon-container" :content="clipboardClicked ? undefined : 'copy'">
				<Link :run="clipboard" style="display: flex">
					<Icon :icon="clipboardIcon" />
				</Link>
			</Tooltip>
			<Tooltip v-if="address" class="icon-container" tabindex="0" :hideOnClick="false">
				<template #content>
					<QR :qr="val" />
				</template>
				<Icon :icon="ICON.qr" />
			</Tooltip>
		</span>
	</div>
</template>



<script setup lang="ts">
import Icon from '@/components/atomic/Icon.vue'
import Tooltip from '@/components/function/Tooltip.vue'
import QR from '@/components/atomic/QR.vue'
import Link from '@/components/function/Link.vue'
import ProfileStore, { getVerification } from '@/store/ProfileStore'
import { computed, ref, watch } from 'vue'
import { ICON } from '@/store/Theme'

const props = defineProps<{
	address?: string
	tx?: string
	block?: string
}>()
const val = computed(() => props.address || props.tx || props.block)

const arverify = computed(() => props.address && ProfileStore.verification[props.address])
watch(() => props.address, async () => props.address && getVerification(props.address), { immediate: true })

const clipboard = computed(() => {
	const address = val.value
	if (!navigator.clipboard?.writeText || !address) { return }
	return () => { navigator.clipboard.writeText(address); clipboardClicked.value = true }
})

const clipboardClicked = ref()
watch(clipboardClicked, clicked => clicked && setTimeout(() => clipboardClicked.value = false, 2000))
const clipboardIcon = computed(() => clipboardClicked.value ? ICON.y : ICON.copy)
</script>



<style scoped>
.address {
	display: inline-flex;
	max-width: 100%;
}

.address-tx {
	display: inline-flex;
	align-items: center;
	white-space: nowrap;
}

.text {
	flex: 1 1 0;
	font-family: monospace, monospace;
	font-size: 1em;
	user-select: all;
	white-space: nowrap;
}

.icon-container {
	margin-inline-start: 4px;
	display: flex;
}
</style>