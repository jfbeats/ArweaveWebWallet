<template>
	<div class="word-list flex-row" style="display: flex; justify-content: space-between; flex-wrap: wrap;">
		<div v-for="(word, i) in wordlist">
			{{ `${i+1}. ${word}` }}
		</div>
	</div>
</template>



<script setup lang="ts">
import { getWordList } from '@/functions/Wallets'
import { computedAsync } from '@/functions/AsyncData'

const wordlist = computedAsync(() => getWordList('english'))
</script>



<style scoped>
.word-list {
	padding: var(--spacing);
	
	/*height: var(--current-vh);*/
}

.flow {
	height: 100%;
	flex: 1 1 0;
}

.item {
	padding: var(--spacing);
	align-items: center;
	justify-content: center;
}

.item-content {
	text-align: justify;
	width: var(--column-width-small);
}
</style>