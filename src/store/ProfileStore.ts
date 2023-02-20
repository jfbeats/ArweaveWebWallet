import { reactive } from 'vue'
import InterfaceStore from '@/store/InterfaceStore'
import { unpackTags } from '@/functions/Transactions'
import { awaitEffect } from '@/functions/AsyncData'
import { graphql } from '@/store/ArweaveStore'
import { ArweaveAccount } from '@/providers/Arweave'
import { TagFilter } from 'arweave-graphql'



const ProfileStore = reactive({
	arweaveId: {} as { [id: string]: ArweaveId },
	arweaveIdStatus: {} as { [id: string]: any },
	verification: {}  as { [id: string]: any },
	verificationStatus: {} as { [id: string]: any },
})

export default ProfileStore



export async function getArweaveId (address?: string) {
	if (!address || !ArweaveAccount.metadata.isAddress(address)) { return }
	if ((ProfileStore.arweaveIdStatus[address] ??= {}).loading) { return }
	ProfileStore.arweaveIdStatus[address].loading = true
	await awaitEffect(() => InterfaceStore.windowVisible)
	try {
		const query = async (tags: TagFilter[]) => (await graphql().getTransactions({ owners: [address], tags, first: 1 }).catch(() => {}))?.transactions?.edges?.[0]?.node
		const promises = [
			async () => query([{ name: 'App-Name', values: ['arweave-id'] }]),
			async () => query([{ name: 'Contract', values: ['t9T7DIOGxx4VWXoCEeYYarFYeERTpWIC1V3y-BPZgKE'] }]).then(tx => {
				const input = tx && unpackTags(tx?.tags, { lowercase: true }).input
				if (!input) { return }
				const parsed = JSON.parse(input) as { [key: string]: string }
				if (parsed.function !== 'claim') { return } // todo fetch additional txs
				return { id: tx.id, tags: Object.entries(parsed).map(([name, value]) => ({ name, value })) }
			}),
			async () => query([{ name: "Protocol-Name", values: ["Account", "Account-0.2", "Account-0.3"] }]).then(tx => {
				return tx
			}), // todo .then to get data and merge with tags
		] as const
		const [main, ...fallback] = promises
		ProfileStore.arweaveId[address] ??= await parseTags(await main())
		if (address === '89tR0-C1m3_sCWCoVCChg4gFYKdiH5_ZDyZpdJ2DDRw') {console.log(ProfileStore.arweaveId[address])}
		ProfileStore.arweaveId[address] ??= await Promise.all(
			fallback.map(f => f().catch(() => {}))
		).then(async fbs => {
			const tags = await Promise.all(fbs.map(async fb => fb && parseTags(fb)))
			return tags.reduce((acc, v) => {
				if (!v) { return acc }
				return Object.assign(acc, Object.fromEntries(Object.entries(v).filter(([n, v]) => v)))
			}, {})
		})
		return ProfileStore.arweaveId[address]
	} catch (e) {
		ProfileStore.arweaveIdStatus[address].loading = false
		console.error(e)
	}
}

type ArweaveId = Partial<Awaited<ReturnType<typeof parseTags>>>
async function parseTags (tx?: { tags: Tag[], id: string }) {
	if (!tx) { return }
	const tags = unpackTags(tx.tags, { lowercase: true })
	const name = tags.name || tags.username || tags.handle
	const text = tags.text || tags.bio || tags.description || tags.body || tags.summary
	const imageAddress = tags.image || tags.avatar || tags.photo || tags.picture || tags.thumbnail
	const imageContent = tags['content-type']?.includes('image') && tx.id || undefined
	const image = ArweaveAccount.metadata.isAddress(imageAddress) ? imageAddress : imageContent
	const identity = { name, text, image }
	return Object.entries(identity).filter(([n, v]) => v).length > 0 ? identity : undefined
}

export async function getVerification (address: string) {
	if (!address || (ProfileStore.verificationStatus[address] ??= {}).loading) { return }
	if (!ArweaveAccount.metadata.isAddress(address)) { return }
	ProfileStore.verificationStatus[address].loading = true
	await awaitEffect(() => InterfaceStore.windowVisible)

	try {
		// ProfileStore.arverify[address] = await getVerification(address)
	} catch (e) {
		ProfileStore.verificationStatus[address].loading = false
		console.error(e)
	}
}