import { reactive } from 'vue'
import InterfaceStore from '@/store/InterfaceStore'
import { unpackTags } from '@/functions/Transactions'
import { getVerification } from 'arverify'
import { awaitEffect } from '@/functions/AsyncData'
import { graphql } from '@/store/ArweaveStore'
import { ArweaveAccount } from '@/providers/Arweave'



const ProfileStore = reactive({
	arweaveId: {} as { [id: string]: any },
	arweaveIdStatus: {} as { [id: string]: any },
	arverify: {}  as { [id: string]: any },
	arverifyStatus: {} as { [id: string]: any },
})

export default ProfileStore



export async function getArweaveId (address: string) {
	if ((ProfileStore.arweaveIdStatus[address] ??= {}).loading) { return }
	if (!address || !ArweaveAccount.metadata.isAddress(address)) { return }
	ProfileStore.arweaveIdStatus[address].loading = true
	await awaitEffect(() => InterfaceStore.windowVisible)

	try {
		// const arweaveIdTx = (await arDB.search().from(address).tag('App-Name', 'arweave-id').findOne())[0]?.node
		const arweaveIdTx = (await graphql().getTransactions({ owners: [address], tags: [{ name: 'App-Name', values: ['arweave-id'] }], first: 1 })).transactions.edges[0]?.node
		if (!arweaveIdTx) { return }
		const tags = unpackTags(arweaveIdTx.tags)
		if (tags.Image && !ArweaveAccount.metadata.isAddress(tags.Image)) { delete tags.image }
		if (!tags.Image && tags['Content-Type']?.includes('image')) { tags.Image = arweaveIdTx.id }
		ProfileStore.arweaveId[address] = tags
	} catch (e) {
		ProfileStore.arweaveIdStatus[address].loading = false
		console.error(e)
	}
}

export async function getArverify (address: string) {
	if (!address || (ProfileStore.arverifyStatus[address] ??= {}).loading) { return }
	if (!ArweaveAccount.metadata.isAddress(address)) { return }
	ProfileStore.arverifyStatus[address].loading = true
	await awaitEffect(() => InterfaceStore.windowVisible)

	try {
		ProfileStore.arverify[address] = await getVerification(address)
	} catch (e) {
		ProfileStore.arverifyStatus[address].loading = false
		console.error(e)
	}
}