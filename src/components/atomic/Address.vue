<template>
	<Tooltip disabled>
		<template #content>
			<div class="text">
				{{ address }}
			</div>
		</template>
		<div class="address ellipsis">
			<span class="address-tx ellipsis">
				<slot />
				<span class="text ellipsis">{{ val }}</span>
				<Tooltip v-if="arverify?.verified" class="icon-container" content="verified">
					<Icon :icon="IconVerify" />
				</Tooltip>
				<Tooltip v-if="clipboard" class="icon-container" :content="clipboardClicked ? undefined : 'copy'">
					<Link :run="clipboard" style="display: flex">
						<Icon :icon="clipboardIcon"  />
					</Link>
				</Tooltip>
				<Tooltip class="icon-container">
					<template #content>
						<QR :qr="address" />
					</template>
					<Icon :icon="IconQR"  />
				</Tooltip>
			</span>
		</div>
	</Tooltip>
</template>



<script setup lang="ts">
import Icon from '@/components/atomic/Icon.vue'
import Tooltip from '@/components/function/Tooltip.vue'
import QR from '@/components/atomic/QR.vue'
import Link from '@/components/function/Link.vue'
import ProfileStore, { getArverify } from '@/store/ProfileStore'
import { computed, ref, watch } from 'vue'

import IconVerify from '@/assets/icons/verify.svg?component'
import IconCopy from '@/assets/icons/copy.svg?component'
import IconQR from '@/assets/icons/qr.svg?component'
import IconY from '@/assets/icons/y.svg?component'

const props = defineProps<{
	address?: string
	tx?: string
	block?: string
}>()
const val = computed(() => props.address || props.tx || props.block)

const arverify = computed(() => props.address && ProfileStore.arverify[props.address])
watch(() => props.address, async () => props.address && getArverify(props.address), { immediate: true })

const clipboard = computed(() => {
	const address = props.address
	if (!navigator.clipboard?.writeText || !address) { return }
	return () => { navigator.clipboard.writeText(address); clipboardClicked.value = true }
})

const clipboardClicked = ref()
watch(clipboardClicked, clicked => clicked && setTimeout(() => clipboardClicked.value = false, 2000))
const clipboardIcon = computed(() => clipboardClicked.value ? IconY : IconCopy)
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