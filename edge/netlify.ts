import '@/main.ts'
import { ArweaveProvider } from '@/providers/Arweave.ts'
import { buildMeta } from './meta.ts'
import { locate } from '@/router/routing.ts'
import "https://deno.land/x/xhr@0.3.0/mod.ts"
import { XmlEntities } from 'https://deno.land/x/html_entities@v1.0/mod.js'
import type { Config, Context } from 'https://edge.netlify.com/'



export default async (request: Request, context: Context) => {
	const id = request.url.split('/').find(e => ArweaveProvider.metadata.isAddress(e))
	if (!id) { return }
	const location = await locate(id)
	if (!location) { return }
	const response = await context.next()
	const page = await response.text()
	const updatedPage = page.replace(/<!-- DATA -->.*<!-- \/DATA -->/gms, buildMeta({}, location, s => XmlEntities.encode(s)))
	return new Response(updatedPage, response)
}

export const config: Config = { path: [
	`/tx/*`,
] }