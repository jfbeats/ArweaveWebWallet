import { ArweaveProvider } from '@/providers/Arweave'
import { arweaveQuery } from '@/store/ArweaveStore'
import router from '@/router'
import type { BlockEdge, TransactionEdge } from 'arweave-graphql'
import { RouteLocationNamedRawAlt } from 'vue-router'



export type IdLocation = ReturnType<typeof buildLocation>
function buildLocation (data: TransactionEdge | BlockEdge, location: RouteLocationNamedRawAlt, id: string) {
	const resolved = router.resolve(location)
	return { data, location, resolved, id }
}

export async function locate (id: string) {
	if (ArweaveProvider.metadata.isAddress(id)) {
		return new Promise<IdLocation | void>(res => Promise.all([
			arweaveQuery({ ids: [id], first: 1 }).fetchQuery.query().then(result => result?.[0] && res(buildLocation(result[0], { name: 'Tx', params: { txId: id } }, id))),
			arweaveQuery({ recipients: [id], first: 1  }).fetchQuery.query().then(result => result?.[0] && res(buildLocation(result[0], { name: 'Profile', params: { key: id } }, id))),
			arweaveQuery({ owners: [id], first: 1  }).fetchQuery.query().then(result => result?.[0] && res(buildLocation(result[0], { name: 'Profile', params: { key: id } }, id))),
		]).then(() => res()))
	} else if (ArweaveProvider.metadata.isBlock(id)) {}
}

export async function asyncRoute (path?: string) {
	if (!path) { return }
	const id = path.split('/')[1]
	const result = await locate(id)
	if (!result) { return false }
	await router.push(result.location)
	return true
}