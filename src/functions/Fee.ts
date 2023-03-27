import { arweave, arweaveQuery } from '@/store/ArweaveStore'
import { notify } from '@/store/NotificationStore'
import { track } from '@/store/Telemetry'
import { getWalletById, Wallets } from '@/functions/Wallets'
import { useChannel } from '@/functions/Channels'
import { compact } from '@/functions/Utils'
import { getAsyncData, useDataWrapper } from '@/functions/AsyncData'
import { RPC } from '@/functions/Connect'
import { manageUpload } from '@/functions/Transactions'
import { SortOrder } from 'arweave-graphql'
import BigNumber from 'bignumber.js'
import { computed, reactive, ref, watch } from 'vue'



export function fee (options: {
	name?: string,
	byteSize: number,
	validityThreshold?: number,
	dustThreshold?: number
}) {
	const recipients = ['TId0Wix2KFl1gArtAT6Do1CbWU_0wneGvS5X9BfW5PE']
	const tagEntries = Object.entries({
		app: 'arweave.app'
	} as const)
	const getRecipient = () => recipients[0]
	const validityThreshold = options.validityThreshold ?? 0.75
	const dustThreshold = options.dustThreshold ?? 0
	const arQuery = getAsyncData({
		name: 'arweave storage price',
		query: async () => arweave.ar.winstonToAr(await arweave.transactions.getPrice(options.byteSize)),
		seconds: 10,
	})
	const ar = arQuery.state
	const hotWallets = computed(() => Wallets.value.filter(w => w.hasPrivateKey && w.balance && +w.balance > (options.dustThreshold ?? 0)))
	const addresses = computed(() => hotWallets.value.map(w => w.key).filter((w): w is NonNullable<typeof w> => !!w))
	const queryParams: Parameters<typeof arweaveQuery>[0] = ref({ owners: addresses.value, recipients, tags: tagEntries.map(t => ({ name: t[0], values: [t[1]] })) })
	const query = arweaveQuery(queryParams)
	// query.refreshSwitch.value = true
	watch(addresses, (value, oldValue) => {
		if (!value.length || JSON.stringify(value) === JSON.stringify(oldValue)) { return }
		queryParams.value!.owners = value
		setTimeout(() => query.fetchAll()) // todo fix setTimeout requirement
	}, { immediate: true })
	const txs = computed(() => query.state.value?.filter(tx => +tx.node.quantity.ar > 0 && tx.node.recipient === getRecipient()) ?? [])
	const owners = computed(() => addresses.value.map(address => txs.value.filter(tx => tx.node.owner.address === address)))
	const states = computed(() => compact(owners.value.map((txs, i) => {
		if (!txs.length) { return }
		const batchOwner = txs[0].node.owner.address
		let balance = new BigNumber(getWalletById(batchOwner)?.balance ?? '0')
		const settled = BigNumber.sum(0, ...txs.filter(tx => tx.node.block?.id).map(tx => tx.node.quantity.ar))
		const pending = BigNumber.sum(0, ...txs.filter(tx => !tx.node.block?.id).map(tx => tx.node.quantity.ar))
		if (!ar.value || balance.minus(pending).isLessThan(dustThreshold)) { return }
		const ratio = settled.plus(pending).div(ar.value).toString() || '0'
		const hasPaid = new BigNumber(ratio).times(ar.value)
		return { batchOwner, i, hasPaid, ratio, txs }
	})))
	const asyncStates = useDataWrapper(states, i => i?.batchOwner ?? '' + i.i, async ({ txs }) => {
		const entries = compact(await Promise.all(txs?.map(async tx => {
			if (!tx.node.block) { return }
			return { tx, price: await arPriceAtHeight(tx.node.block?.height, options.byteSize) }
		}) ?? []))
		return compact(entries.map(({ tx, price }) => {
			if (!ar.value) { return }
			const ratio = new BigNumber(tx.node.quantity.ar).div(price).toString()
			const hasPaid = new BigNumber(ratio).times(ar.value).toString()
			return { ratio, hasPaid }
		}))
	})
	const hasPaid = computed(() => BigNumber.max(0,
		BigNumber.sum(0, ...states.value.map(s => s.hasPaid)),
		BigNumber.sum(0, ...asyncStates.value.flat().map(s => s.hasPaid)),
	).toString())
	const remaining = computed(() => ar.value && new BigNumber(ar.value).minus(hasPaid.value).toString())
	const isPaid = computed(() => ar.value && new BigNumber(hasPaid.value).gt(new BigNumber(ar.value).times(validityThreshold)))
	const isPaying = ref(false)
	let timeout = undefined as any
	watch(isPaid, b => b && (isPaying.value = false), { immediate: true })
	watch(isPaying, b => b ? (timeout ??= setTimeout(() => { notify.warn('Seems like your transaction is not found by the network. Try again later if the problem is not solved') }, 40000)) : clearTimeout(timeout))
	const pay = async () => {
		// todo make sure to always at least leave the dust threshold in the wallet
		if (!ar.value || ar.value === '0') { throw 'fee not yet defined' }
		if (isPaying.value && !await notify.confirm('The fee is already being paid. Do you want to make a second payment?').promise) { throw 'already being paid' }
		const quantity = arweave.ar.arToWinston(new BigNumber(ar.value).minus(hasPaid.value).toString())
		const tx = await arweave.createTransaction({ target: getRecipient(), quantity })
		tagEntries.forEach(e => tx.addTag(e[0], e[1]))
		const state = RPC.arweave.connect('Fee')
		const walletId = Wallets.value.find(w => {
			if (recipients.includes(w.key ?? '')) { return false }
			return w.hasPrivateKey && new BigNumber(w.balance ?? '0').gt(remaining.value ?? 0)
		})?.id
		if (walletId == undefined) { notify.log('Fund and select a wallet to transfer tokens') }
		if (state.channel.state.value) { state.channel.state.value.walletId = walletId }
		track.event('Fee', options.name)
		const signedTx = await RPC.arweave.signTransaction(tx)
		track.event('Fee Paid', options.name)
		isPaying.value = true
		manageUpload(signedTx)
		return signedTx.id
	}
	return reactive({ ar, remaining, hasPaid, isPaid, isPaying, pay, txs })
}


const storagePriceCache = useChannel('storagePrice', '', {}).state
async function arPriceAtHeight (height: string | number, byteSize: string | number) {
	const fetch = async () => {
		const query = arweaveQuery({ block: { min: +height }, sort: SortOrder.HeightAsc, bundledIn: undefined, first: 100 })
		const computedQuery = () => query.state.value?.filter(tx => !tx.node.bundledIn && tx.node.data.size !== '0') ?? []
		while (!query.status.completed && computedQuery().length < 20) { await query.fetchQuery.query() }
		const results = computedQuery().map(tx => new BigNumber(tx.node.fee.winston).div(Math.max(parseInt(tx.node.data.size), 256000)))
		const res = BigNumber.min(...results).toString()
		storagePriceCache.value[height] = res
		return res
	}
	const res = new BigNumber(storagePriceCache.value[height] || await fetch()).times(byteSize)
	return arweave.ar.winstonToAr(res.toString())
}