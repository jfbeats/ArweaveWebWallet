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
	const pendingRewards = {} as { [key: string]: bigint}
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
		const pendingRewardSize = binaryData[rewardSizePosition]
		const rewardPosition = rewardSizePosition + 1
		const rewardSizeBytes = pendingRewardSize
		const reward = binaryData.slice(rewardPosition, rewardPosition + rewardSizeBytes)
		const denominationPosition = rewardPosition + rewardSizeBytes
		const denominationSize = 3
		const denomination = new DataView(binaryData.buffer, denominationPosition, denominationSize)
		offset = denominationPosition + denominationSize
		const Addr = binaryData.slice(addrPosition, addrPosition + addrSize)
		const addrBase64url = btoa(String.fromCharCode(...Addr)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
		const buffer = new Uint8Array(reward)
		const rewardBigint = BigInt(`0x${Array.from(buffer).map(b => b.toString(16).padStart(2, '0')).join('')}`)
		if (pendingRewards[addrBase64url] == null) { pendingRewards[addrBase64url] = 0n }
		pendingRewards[addrBase64url] += rewardBigint
		parsedData.push({
			Addr: addrBase64url,
			HashRateSize: hashRateSize,
			HashRate: hashRate,
			pendingRewardSize: pendingRewardSize,
			pendingReward: pendingRewards[addrBase64url].toString(),
			Denomination: denomination
		})
	}
	return Object.fromEntries(Object.values(parsedData).map(e => [e.Addr, e]))
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