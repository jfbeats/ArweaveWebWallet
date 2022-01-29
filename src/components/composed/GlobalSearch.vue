<template>
	<Input v-model="search" :actions="[searchAction]" placeholder="Search" style="flex:1 1 0;" />
</template>



<script setup lang="ts">
import Input from '@/components/atomic/Input.vue'
import IconSearch from '@/assets/icons/search.svg?component'
import { ref } from 'vue'

const search = ref('')
const searchAction = { run: () => {}, icon: IconSearch }

// search in address, tx, username (arweave id tags)

</script>



<style scoped>

</style>