import { arweaveQuery } from '@/store/ArweaveStore'
import router from '@/router'



export async function asyncRoute (id?: string) { // todo
	if (!id) { return }
	return Promise.all([
		arweaveQuery({ ids: [id], first: 1 }).fetchQuery.query().then(res => res[0] && router.replace({ name: 'Tx', params: { txId: id } })),
		arweaveQuery({ recipients: [id], first: 1  }).fetchQuery.query().then(res => res[0] && router.replace({ name: 'Profile', params: { key: id } })),
		arweaveQuery({ owners: [id], first: 1  }).fetchQuery.query().then(res => res[0] && router.replace({ name: 'Profile', params: { key: id } })),
	])
}