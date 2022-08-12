<template>
	<div>
		<SettingItem :name="'Connectivity'">
			<Select v-model="ledgerSettings.selectedTransport" :options="options" />
		</SettingItem>
	</div>
</template>



<script setup lang="ts">
import Select from '@/components/form/Select.vue'
import { availableTransports, ledgerSettings } from '@/providers/Ledger'
import { computed } from 'vue'
import SettingItem from '@/components/composed/SettingItem.vue'

const options = computed(() => availableTransports.value.map(t => ({ value: t.name, text: t.name })))
</script>