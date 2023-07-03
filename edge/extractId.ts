import { compactTrue } from '@/functions/Utils'
import { locate } from '@/router/routing'

async function extractId(urlString: string) {
	if (!urlString) { return }
	const url = new URL(urlString)
	const idsMaybe = await Promise.all(url.pathname.split('/').reverse().map(param => param && locate(param)))
	const ids = compactTrue(idsMaybe)
	if (!ids.length) { return }
	const link = `https://arweave.net/${id}`
}
