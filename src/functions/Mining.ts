import { getAsyncData } from '@/functions/AsyncData'
import ArweaveStore, { getIndepHash } from '@/store/ArweaveStore'
import { Wallets } from '@/functions/Wallets'
import { compact } from '@/functions/Utils'
import { useChannel } from '@/functions/Channels'
import { computed } from 'vue'

async function get_reward_history () {
	const url = `${ArweaveStore.gatewayURL}reward_history/${await getIndepHash()}` as string
	return fetch(url).then(response => response.arrayBuffer()).then(r => new Uint8Array(r))
}

async function getMiningData () {
	const binaryData = await get_reward_history()
	const parsedData = []
	let offset = 0
	while(offset < binaryData.length) {
		const addrPosition = offset
		const addrSize = 32
		const hashRateSizePosition = addrPosition + addrSize
		const hashRateSize = binaryData[hashRateSizePosition]
		const hashRatePosition = hashRateSizePosition + 1
		const hashRateSizeBytes = hashRateSize
		const hashRate = binaryData.slice(hashRatePosition, hashRatePosition + hashRateSizeBytes)
		const rewardSizePosition = hashRatePosition + hashRateSizeBytes
		const rewardSize = binaryData[rewardSizePosition]
		const rewardPosition = rewardSizePosition + 1
		const rewardSizeBytes = rewardSize
		const reward = binaryData.slice(rewardPosition, rewardPosition + rewardSizeBytes)
		const denominationPosition = rewardPosition + rewardSizeBytes
		const denominationSize = 3
		const denomination = new DataView(binaryData.buffer, denominationPosition, denominationSize)
		offset = denominationPosition + denominationSize
		const Addr = binaryData.slice(addrPosition, addrPosition + addrSize)
		const addrBase64url = btoa(String.fromCharCode(...Addr)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
		const buffer = new Uint8Array(reward)
		const rewardBigint = BigInt(`0x${Array.from(buffer).map(b => b.toString(16).padStart(2, '0')).join('')}`)
		parsedData.push({
			Addr: addrBase64url,
			HashRateSize: hashRateSize,
			HashRate: hashRate,
			RewardSize: rewardSize,
			Reward: rewardBigint,
			Denomination: denomination
		})
	}

	const pendingRewards = {} as { [key: string]: bigint }
	const pendingHistoryLength = 21600 // after 2.8 only part of history represents pending rewards
	const parsedDataPending = parsedData.slice(parsedData.length - pendingHistoryLength)

	for (const entity of parsedDataPending) {
		const Addr  = entity.Addr
		const Reward = entity.Reward
		if (pendingRewards[Addr] == null) { pendingRewards[Addr] = 0n }
		pendingRewards[Addr] += Reward
	}

	return Object.fromEntries(Object.entries(pendingRewards).map(([k,v]) => [k, v.toString()]))
}

export type MiningData = Awaited<ReturnType<typeof getMiningData>>

const existingState = useChannel('miningData').state

export const miningData = getAsyncData({
	awaitEffect: () => compact(Wallets.value.map(w => w.key)).length,
	query: getMiningData,
	existingState,
	timestamp: useChannel('miningDataTimestamp').state,
	seconds: computed(() => {
		const addresses = compact(Wallets.value.map(w => w.key))
		const state = existingState.value
		return state && !addresses.find(a => state[a]) ? 60 * 60 * 2 : 60 * 10
	}),
})