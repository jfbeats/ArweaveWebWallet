<template>
	<span>
		<Ar :ar="ar" />&nbsp;
		<LocaleCurrency class="secondary-text" :ar="ar" />
	</span>
</template>

<script>
import Ar from '@/components/atomic/Ar.vue'
import LocaleCurrency from '@/components/atomic/LocaleCurrency.vue'

export default {
	components: { Ar, LocaleCurrency },
	props: ['ar']
}
</script>
