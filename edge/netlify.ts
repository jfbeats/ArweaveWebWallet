import { buildMeta } from './meta.ts'
import type { Config, Context } from 'https://edge.netlify.com/'
import { XmlEntities } from "https://deno.land/x/html_entities/mod.ts"



export default async (request: Request, context: Context) => {
	const response = await context.next()
	const page = await response.text()
	const updatedPage = page.replace(/<!-- DATA -->.*<!-- \/DATA -->/gms, buildMeta({}, request.url))
	console.log(XmlEntities.encode(`<>"\\\''"&©®`))
	return new Response(updatedPage, response)
}

export const config: Config = { path: [
	`/tx/${Array(43).fill('[a-z0-9_-]').join('')}`,
	`/${Array(43).fill('[a-z0-9_-]').join('')}`,
] }