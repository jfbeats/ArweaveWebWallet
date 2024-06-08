import { reactive } from 'vue'
import InterfaceStore from '@/store/InterfaceStore'
import { unpackTags } from '@/functions/Transactions'
import { awaitEffect } from '@/functions/AsyncData'
import { getData, graphql } from '@/store/ArweaveStore'
import { ArweaveAccount } from '@/providers/Arweave'
import { TagFilter } from 'arweave-graphql'
import { compact } from '@/functions/Utils'



const ProfileStore = reactive({
	arweaveId: {} as { [id: string]: ArweaveId | undefined },
	arweaveIdStatus: {} as { [id: string]: any },
	verification: {}  as { [id: string]: any },
	verificationStatus: {} as { [id: string]: any },
	ans: {} as { [id: string]: any },
	ansStatus: {} as { [id: string]: any },
	ansDomainLookup: {} as { [id: string]: any },
	ansDomainLookupStatus: {} as { [id: string]: any },
})

export default ProfileStore

export async function getANS (address?: string) {
	if (!address || !ArweaveAccount.metadata.isAddress(address)) { return }
	if ((ProfileStore.ansStatus[address] ??= {}).loading) { return }
	ProfileStore.ansStatus[address].loading = true
	await awaitEffect(() => InterfaceStore.windowVisible)
	try {
		const ANSResponse=await fetch(`https://ans-resolver.herokuapp.com/resolve/${address}`).then(res=>res.json())
		ProfileStore.ans[address] =ANSResponse
		if (!ProfileStore.ans[address]) { 
			ProfileStore.ans[address] = {}
			
		} 

		return ProfileStore.ans[address]
	} catch (e) {
		ProfileStore.ansStatus[address].loading = false
		console.error(e)
	}
}
export async function getANSDomain (domain?: string) {
	if (!domain || !domain.endsWith('.ar')) { return }
	if ((ProfileStore.ansDomainLookupStatus[domain] ??= {}).loading) {return }
	ProfileStore.ansDomainLookupStatus[domain].loading = true
	await awaitEffect(() => InterfaceStore.windowVisible)
	if(ProfileStore.ansDomainLookup[domain]?.address){
		return ProfileStore.ansDomainLookup[domain]
	}
	try {
		const ANSResponse=await fetch(`https://ans-resolver.herokuapp.com/find-user/${domain.split('.')[0]}`).then(res=>res.json())
		
		ProfileStore.ansDomainLookup[domain] =ANSResponse
		if (!ProfileStore.ansDomainLookup[domain]) { 
			ProfileStore.ansDomainLookup[domain] = {}
		} 

		return ProfileStore.ansDomainLookup[domain]
	} catch (e) {
		
		console.error(e)
	}finally{
		ProfileStore.ansDomainLookupStatus[domain].loading = false
	}
}

export async function getArweaveId(address?: string) {
	if (!address || !ArweaveAccount.metadata.isAddress(address)) { return }
	if ((ProfileStore.arweaveIdStatus[address] ??= {}).loading) { return }
	ProfileStore.arweaveIdStatus[address].loading = true
	await awaitEffect(() => InterfaceStore.windowVisible)
	try {
		const query = async (tags: TagFilter[]) => (await graphql.getTransactions({ owners: [address], tags, first: 1 }).catch(() => {}))?.transactions?.edges?.[0]?.node
		const promises = [
			async () => query([{ name: 'App-Name', values: ['arweave-id'] }]),
			async () => query([{ name: 'Contract', values: ['t9T7DIOGxx4VWXoCEeYYarFYeERTpWIC1V3y-BPZgKE'] }]).then(tx => {
				const input = tx && unpackTags(tx?.tags, { lowercase: true }).input
				if (!input) { return }
				const parsed = JSON.parse(input) as { [key: string]: string }
				if (parsed.function !== 'claim') { return } // todo fetch additional txs
				return { ...tx, tags: Object.entries(parsed).map(([name, value]) => ({ name, value })) }
			}),
			async () => query([{ name: "Protocol-Name", values: ["Account", "Account-0.2", "Account-0.3"] }]).then(async tx => {
				if (!tx) { return }
				const data = JSON.parse(await getData(tx.id) || '') as { [key: string]: any }
				const tags = Object.entries(data).map(([name, value]) => {
					typeof value === 'string' && value.startsWith('ar://') && (value = value.substring('ar://'.length))
					return { name, value }
				}).filter(({ value }) => value !== 'OrG-ZG2WN3wdcwvpjz1ihPe4MI24QBJUpsJGIdL85wA')
				return { ...tx, tags }
			}),
		] as const
		const [main, ...fallback] = promises
		ProfileStore.arweaveId[address] ??= await parseTags(await main())
		if (!ProfileStore.arweaveId[address]) { await Promise.all(fallback.map(f => f().catch(() => {}))).then(async fbs => {
			const txs = fbs.sort((a, b) => (b?.block?.height || 0) - (a?.block?.height || 0))
			const txsTags = compact(await Promise.all(txs.map(async fb => fb && parseTags(fb))))
			ProfileStore.arweaveId[address] ??= {}
			txsTags.forEach(tags => Object.entries(tags).forEach(([name, value]) => ProfileStore.arweaveId[address]![name as keyof ArweaveId] ??= value))
		}) }
		return ProfileStore.arweaveId[address]
	} catch (e) {
		ProfileStore.arweaveIdStatus[address].loading = false
		console.error(e)
	}
}


type ArweaveId = Partial<NonNullable<Awaited<ReturnType<typeof parseTags>>>>
async function parseTags (tx?: { tags: Tag[], id: string }) {
	if (!tx) { return }
	const tags = unpackTags(tx.tags, { lowercase: true })
	const name = tags.name || tags.username || tags.handle
	const text = tags.text || tags.bio || tags.description || tags.body || tags.summary
	const imageAddress = tags.image || tags.avatar || tags.photo || tags.picture || tags.thumbnail || tags.src
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