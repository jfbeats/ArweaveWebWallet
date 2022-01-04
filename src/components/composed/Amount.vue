<template>
	<span>
		<Ar :ar="ar" />&nbsp;
		<LocaleCurrency class="secondary-text" :ar="ar" />
	</span>
</template>



<script setup>
import Ar from '@/components/atomic/Ar.vue'
import LocaleCurrency from '@/components/atomic/LocaleCurrency.vue'

const props = defineProps(['ar'])
</script>