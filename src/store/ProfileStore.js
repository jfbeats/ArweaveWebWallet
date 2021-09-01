import { reactive } from 'vue'
import { arDB } from '@/store/ArweaveStore'
import { sleepUntilVisible } from '@/store/InterfaceStore'
import { unpackTags } from '@/functions/Utils'
import { getVerification } from 'arverify'



const ProfileStore = reactive({
	arweaveId: {},
	arweaveIdStatus: {},
	arverify: {},
	arverifyStatus: {},
})

export default ProfileStore



export async function getArweaveId (address) {
	if ((ProfileStore.arweaveIdStatus[address] ??= {}).loading) { return }
	if (!address.match(/^[a-z0-9_-]{43}$/i)) { return }
	ProfileStore.arweaveIdStatus[address].loading = true

	try {
		const arweaveIdTx = (await arDB.search().from(address).tag('App-Name', 'arweave-id').findOne())[0]?.node
		if (!arweaveIdTx) { return }
		const tags = unpackTags(arweaveIdTx.tags)
		if (tags.Image && !tags.Image.match(/^[a-z0-9_-]{43}$/i)) { delete tags.image }
		ProfileStore.arweaveId[address] = tags
	} catch (e) {
		ProfileStore.arweaveIdStatus[address].loading = false
		console.error(e)
	}
}

export async function getArverify (address) {
	if ((ProfileStore.arverifyStatus[address] ??= {}).loading) { return }
	if (!address.match(/^[a-z0-9_-]{43}$/i)) { return }
	ProfileStore.arverifyStatus[address].loading = true
	console.log('ok')

	try {
		ProfileStore.arverify[address] = await getVerification(address)
	} catch (e) {
		ProfileStore.arverifyStatus[address].loading = false
		console.error(e)
	}
}



if (process.env.NODE_ENV === 'development') {
	window.ProfileStore = ProfileStore
}