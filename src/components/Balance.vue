<template>
	<div class="balance">
		<div class="amounts">
			<Ar class="ar" :ar="wallet.balance" /><br>
			<LocaleCurrency class="currency" :ar="wallet.balance" />
		</div>
		<div class="info">
			<Address :address="wallet.key" />
		</div>
		<div class="actions">
			<Action :to="{name: 'Send', query: {...$route.query}}" img="north_east.svg">Send</Action>
			<Action :to="{name: 'Tx', query: {...$route.query}}" img="swap.svg">Transactions</Action>
			<Action :to="{name: 'Tokens', query: {...$route.query}}" img="cloud_circle.svg">Tokens</Action>
		</div>
	</div>
</template>

<script>
import Address from '@/components/atomic/Address'
import Ar from '@/components/atomic/Ar'
import LocaleCurrency from '@/components/atomic/LocaleCurrency'
import Action from '@/components/atomic/Action'

export default 	{
	components: { Address, Ar, LocaleCurrency, Action },
	props: ['wallet'],
}
</script>

<style scoped>
.balance {
	border-radius: 24px;
	overflow: hidden;
	line-height: 1.2;
	padding: var(--spacing) 0;
	display: flex;
	flex-direction: column;
}

.balance > * {
	padding: var(--spacing);
	margin-bottom: var(--spacing);
}

.amounts {
	font-size: 2em;
}

.currency {
	font-size: 0.5em;
}

.info {
	font-size: 0.75em;
	color: var(--element-secondary);
}

.actions {
	padding: 0;
}

.action {
	padding: var(--spacing);
	margin: calc(var(--spacing) / 2) 0;
	border-radius: var(--border-radius);
	transition: 0.1s ease;
}

.action:hover {
	background: #00000022;
}


</style>
