import { ArweaveProvider } from '@/providers/Arweave'
import { arweaveQuery } from '@/store/ArweaveStore'
import router from '@/router'



export async function asyncRoute (path?: string) {
	if (!path) { return }
	const idMaybe = path.split('/')[1]
	const id = ArweaveProvider.metadata.isAddress(idMaybe) ? idMaybe : undefined
	if (!id) { return false }
	const result = await new Promise<Parameters<typeof router.push>[0] | void>(res => Promise.all([
		arweaveQuery({ ids: [id], first: 1 }).fetchQuery.query().then(result => result[0] && res({ name: 'Tx', params: { txId: id } })),
		arweaveQuery({ recipients: [id], first: 1  }).fetchQuery.query().then(result => result[0] && res({ name: 'Profile', params: { key: id } })),
		arweaveQuery({ owners: [id], first: 1  }).fetchQuery.query().then(result => result[0] && res({ name: 'Profile', params: { key: id } })),
	]).then(() => res()))
	if (!result) { return false }
	await router.push(result)
	return true
}